import { Module } from '@nestjs/common';
import { NotificationController } from './presentation/notification.controller';
import { NotificationService } from './application/notification.service';
import { NotificationRepository } from './infrastructure/notification.repository';

@Module({
    controllers: [NotificationController],
    providers: [NotificationService, NotificationRepository],
    exports: [NotificationService],
})
export class NotificationModule { }
