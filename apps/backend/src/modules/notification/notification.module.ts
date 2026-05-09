import { Module } from '@nestjs/common';
import { NotificationController } from './presentation/notification.controller';
import { NotificationService } from './application/notification.service';
import { NotificationRepository } from './infrastructure/notification.repository';
import { WebPushService } from './application/web-push.service';

@Module({
    controllers: [NotificationController],
    providers: [NotificationService, NotificationRepository, WebPushService],
    exports: [NotificationService, WebPushService],
})
export class NotificationModule { }
