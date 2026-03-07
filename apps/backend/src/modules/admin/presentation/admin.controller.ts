import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '@common/index';
import { AdminService } from '../application/admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('dashboard/stats')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('reports/stats')
    @ApiOperation({ summary: 'Get report statistics' })
    async getReportStats() {
        return this.adminService.getReportStats();
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
}
