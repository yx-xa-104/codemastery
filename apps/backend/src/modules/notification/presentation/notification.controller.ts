import { Controller, Get, Post, Patch, Delete, Param, UseGuards, Body, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, CurrentUser, RolesGuard, Roles } from '@common/index';
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
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Admin testing: Broadcast custom push' })
    async testBroadcastPush(@Body() payload: any) {

        const title = payload.title || '🔔 Thông báo hệ thống';
        const body = payload.body;
        const url = payload.url || '/';
        const targetRole = payload.targetRole || 'all';

        await this.notificationService.broadcast(title, body, targetRole, url);

        return this.webPushService.broadcastPush({
            title, body, url
        }, targetRole);
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
