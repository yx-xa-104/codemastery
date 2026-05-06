import { Module } from '@nestjs/common';
import { DailyReminderService } from './daily-reminder.service';
import { NotificationModule } from '../notification/notification.module';
import { SupabaseModule } from '../../infrastructure/database/supabase.module';

@Module({
    imports: [NotificationModule, SupabaseModule],
    providers: [DailyReminderService],
})
export class CronModule {}
