import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, RolesGuard, Roles } from '@common/index';
import { AdminService } from '../application/admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('dashboard/stats')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('dashboard/recent-courses')
    @ApiOperation({ summary: 'Get recent courses for dashboard' })
    async getRecentCourses() {
        return this.adminService.getRecentCourses();
    }

    @Get('dashboard/recent-students')
    @ApiOperation({ summary: 'Get recently enrolled students' })
    async getRecentStudents() {
        return this.adminService.getRecentStudents();
    }

    @Get('reports/stats')
    @ApiOperation({ summary: 'Get report statistics' })
    async getReportStats() {
        return this.adminService.getReportStats();
    }

    @Get('reports/top-courses')
    @ApiOperation({ summary: 'Get top courses by enrollments' })
    async getTopCourses() {
        return this.adminService.getTopCourses();
    }

    @Get('reports/enrollments-chart')
    @ApiOperation({ summary: 'Get enrollment chart data' })
    async getEnrollmentsChart(@Query('days') days?: string) {
        return this.adminService.getEnrollmentsByDay(days ? parseInt(days) : 7);
    }

    @Get('students')
    @ApiOperation({ summary: 'Get all students' })
    async getStudents() {
        return this.adminService.getStudents();
    }

    @Get('enrollments')
    @ApiOperation({ summary: 'Get recent enrollments' })
    async getRecentEnrollments() {
        return this.adminService.getRecentEnrollments();
    }

    @Get('users')
    @ApiOperation({ summary: 'Get all users with profiles' })
    async getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @Patch('users/:id/role')
    @ApiOperation({ summary: 'Change user role' })
    async changeUserRole(
        @Param('id') id: string,
        @Body() body: { role: string },
    ) {
        return this.adminService.updateUserRole(id, body.role);
    }

    @Patch('users/:id/status')
    @ApiOperation({ summary: 'Lock or unlock user account' })
    async toggleUserLock(
        @Param('id') id: string,
        @Body() body: { locked: boolean },
    ) {
        return this.adminService.updateUserLockStatus(id, body.locked);
    }
}
