import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../infrastructure/notification.repository';

@Injectable()
export class NotificationService {
    constructor(private notificationRepository: NotificationRepository) { }

    async findByUser(userId: string) {
        const [notifications, unreadCount] = await Promise.all([
            this.notificationRepository.findByUser(userId),
            this.notificationRepository.countUnread(userId),
        ]);
        return { notifications, unreadCount };
    }

    async markAsRead(id: string, userId: string) {
        return this.notificationRepository.markAsRead(id, userId);
    }

    async markAllAsRead(userId: string) {
        return this.notificationRepository.markAllAsRead(userId);
    }

    async delete(id: string, userId: string) {
        return this.notificationRepository.delete(id, userId);
    }

    async create(userId: string, title: string, body?: string, type = 'system', linkUrl?: string) {
        return this.notificationRepository.create(userId, title, body, type, linkUrl);
    }

    async broadcast(title: string, body: string, targetRole: string, url: string) {
        // Need to access supabase to fetch users. Let's access it via repository
        // Alternatively, we can inject SupabaseService here, but since Repository already has it,
        // it's cleaner to add a method in repository or use type assertion.
        const supabase = (this.notificationRepository as any).supabase;
        
        let query = supabase.admin.from('profiles').select('id');
        if (targetRole !== 'all') {
            query = query.eq('role', targetRole);
        }
        
        const { data: users } = await query;
        if (!users || users.length === 0) return;

        const notifications = users.map((u: any) => ({
            user_id: u.id,
            title: title || '🔔 Thông báo hệ thống',
            body: body || '',
            type: 'system',
            link_url: url || '/'
        }));

        return this.notificationRepository.createBulk(notifications);
    }
}
