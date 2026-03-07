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
}
