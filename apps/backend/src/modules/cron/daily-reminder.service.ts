import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SupabaseService } from '../../infrastructure/database/supabase.service';
import { NotificationService } from '../notification/application/notification.service';
import { WebPushService } from '../notification/application/web-push.service';

@Injectable()
export class DailyReminderService {
    private readonly logger = new Logger(DailyReminderService.name);

    constructor(
        private readonly supabase: SupabaseService,
        private readonly notificationService: NotificationService,
        private readonly webPushService: WebPushService,
    ) {}

    // Chạy vào lúc 12:00 PM mỗi ngày
    @Cron('0 12 * * *')
    async handleDailyReminder() {
        this.logger.log('Bắt đầu chạy Cron Job: Nhắc nhở học tập hàng ngày (12:00 PM)');

        try {
            const today = new Date().toISOString().split('T')[0];

            // Tìm các user có role student mà chưa có hoạt động hôm nay
            // Bao gồm: last_activity_date < today HOẶC last_activity_date is null
            const { data, error } = await this.supabase.admin
                .from('profiles')
                .select('id, full_name, last_activity_date')
                .eq('role', 'student')
                .or(`last_activity_date.lt.${today},last_activity_date.is.null`);

            const users = data as any[];

            if (error) {
                this.logger.error('Lỗi khi lấy danh sách user để nhắc nhở', error);
                return;
            }

            if (!users || users.length === 0) {
                this.logger.log('Tất cả sinh viên đều đã học hôm nay. Không có ai cần nhắc nhở.');
                return;
            }

            this.logger.log(`Tìm thấy ${users.length} sinh viên chưa học hôm nay. Đang tiến hành gửi Push Notification...`);

            // Gửi notification cho từng user
            let sentCount = 0;
            for (const user of users) {
                const title = 'Đến giờ học rồi! 🚀';
                const body = `Chào ${user.full_name || 'bạn'}, hôm nay bạn chưa vào học CodeMastery đấy. Dành ra 15 phút để học bài mới và giữ chuỗi học tập nhé!`;
                
                // Lưu notification vào DB
                await this.notificationService.create(
                    user.id,
                    title,
                    body,
                    'push_reminder',
                    '/learning'
                );

                // Gửi Native Web Push
                await this.webPushService.sendPushToUser(user.id, {
                    title,
                    body,
                    url: '/learning'
                });

                sentCount++;
            }

            this.logger.log(`Hoàn thành! Đã gửi thành công ${sentCount} thông báo nhắc nhở.`);
        } catch (error) {
            this.logger.error('Lỗi bất ngờ khi chạy Cron Job Daily Reminder', error);
        }
    }
}
