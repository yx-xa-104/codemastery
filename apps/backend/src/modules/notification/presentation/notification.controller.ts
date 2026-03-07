import { Controller, Get, Post, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, CurrentUser } from '@common/index';
import { NotificationService } from '../application/notification.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('notifications')
export class NotificationController {
    constructor(private notificationService: NotificationService) { }

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
