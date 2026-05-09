import { Controller, Get, Post, Patch, Delete, Param, UseGuards, Body, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, CurrentUser } from '@common/index';
import { NotificationService } from '../application/notification.service';
import { WebPushService } from '../application/web-push.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('notifications')
export class NotificationController {
    constructor(
        private notificationService: NotificationService,
        private webPushService: WebPushService
    ) { }

    @Post('web-push/subscribe')
    @ApiOperation({ summary: 'Subscribe to web push notifications' })
    async subscribeToWebPush(@CurrentUser('id') userId: string, @Body() subscription: any) {
        return this.webPushService.saveSubscription(userId, subscription);
    }

    @Post('web-push/test-broadcast')
    @ApiOperation({ summary: 'Admin testing: Broadcast custom push' })
    async testBroadcastPush(@CurrentUser('role') role: string, @Body() payload: any) {
        if (role !== 'admin') {
            throw new ForbiddenException('Only administrators can broadcast notifications.');
        }
        
        return this.webPushService.broadcastPush({
            title: payload.title || '🔔 Kiểm tra hệ thống Web Push',
            body: payload.body || 'Đây là tin nhắn thử nghiệm gửi đến tất cả các thiết bị đã đăng ký!',
            url: payload.url || '/'
        }, payload.targetRole || 'all');
    }

    @Get()
    @ApiOperation({ summary: 'Get my notifications with unread count' })
    findAll(@CurrentUser('id') userId: string) {
        return this.notificationService.findByUser(userId);
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Mark a notification as read' })
    markAsRead(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.notificationService.markAsRead(id, userId);
    }

    @Post('read-all')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    markAllAsRead(@CurrentUser('id') userId: string) {
        return this.notificationService.markAllAsRead(userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a notification' })
    remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.notificationService.delete(id, userId);
    }
}
