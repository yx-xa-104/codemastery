import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, RolesGuard, Roles, CurrentUser } from '@common/index';
import { AdminCourseService } from '../application/admin-course.service';
import { IsOptional, IsString, IsUUID } from 'class-validator';

class RejectCourseDto {
    @IsString()
    reason!: string;
}

class TransferOwnershipDto {
    @IsUUID()
    new_teacher_id!: string;
}

class AssignCategoryDto {
    @IsUUID()
    category_id!: string;
}

@ApiTags('admin/courses')
@Controller('admin/courses')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('admin')
export class AdminCourseController {
    constructor(private adminCourseService: AdminCourseService) { }

    @Get()
    @ApiOperation({ summary: 'Get all courses (any status) for admin' })
    findAll(@Query('status') status?: string) {
        return this.adminCourseService.findAll(status);
    }

    @Patch(':id/approve')
    @ApiOperation({ summary: 'Approve a course → published' })
    approve(
        @Param('id') id: string,
        @CurrentUser('id') adminId: string,
    ) {
        return this.adminCourseService.approve(id, adminId);
    }

    @Patch(':id/reject')
    @ApiOperation({ summary: 'Reject a course with reason' })
    reject(
        @Param('id') id: string,
        @Body() body: RejectCourseDto,
        @CurrentUser('id') adminId: string,
    ) {
        return this.adminCourseService.reject(id, adminId, body.reason);
    }

    @Patch(':id/suspend')
    @ApiOperation({ summary: 'Suspend a course (copyright/harmful content)' })
    suspend(
        @Param('id') id: string,
        @CurrentUser('id') adminId: string,
    ) {
        return this.adminCourseService.suspend(id, adminId);
    }

    @Patch(':id/unpublish')
    @ApiOperation({ summary: 'Unpublish a course → draft' })
    unpublish(
        @Param('id') id: string,
        @CurrentUser('id') adminId: string,
    ) {
        return this.adminCourseService.unpublish(id, adminId);
    }

    @Patch(':id/transfer')
    @ApiOperation({ summary: 'Transfer course ownership to another teacher' })
    transfer(
        @Param('id') id: string,
        @Body() body: TransferOwnershipDto,
    ) {
        return this.adminCourseService.transferOwnership(id, body.new_teacher_id);
    }

    @Patch(':id/category')
    @ApiOperation({ summary: 'Assign course to a category' })
    assignCategory(
        @Param('id') id: string,
        @Body() body: AssignCategoryDto,
    ) {
        return this.adminCourseService.assignCategory(id, body.category_id);
    }
}
