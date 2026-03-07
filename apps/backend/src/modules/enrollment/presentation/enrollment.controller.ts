import { Controller, Post, Delete, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, CurrentUser } from '@common/index';
import { EnrollmentService } from '../application/enrollment.service';
import { UpdateProgressDto } from './dtos/update-progress.dto';

@ApiTags('enrollments')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('enrollments')
export class EnrollmentController {
    constructor(private enrollmentService: EnrollmentService) { }

    @Get()
    @ApiOperation({ summary: 'Get my enrolled courses' })
    getMyEnrollments(@CurrentUser('id') userId: string) {
        return this.enrollmentService.getMyEnrollments(userId);
    }

    @Post(':courseId')
    @ApiOperation({ summary: 'Enroll in a course' })
    enroll(@CurrentUser('id') userId: string, @Param('courseId') courseId: string) {
        return this.enrollmentService.enroll(userId, courseId);
    }

    @Delete(':courseId')
    @ApiOperation({ summary: 'Unenroll from a course' })
    unenroll(@CurrentUser('id') userId: string, @Param('courseId') courseId: string) {
        return this.enrollmentService.unenroll(userId, courseId);
    }

    @Patch(':courseId/progress')
    @ApiOperation({ summary: 'Update course progress' })
    updateProgress(
        @CurrentUser('id') userId: string,
        @Param('courseId') courseId: string,
        @Body() body: UpdateProgressDto,
    ) {
        return this.enrollmentService.updateProgress(userId, courseId, body.progressPercent, body.currentLessonId);
    }

    @Post('lessons/:lessonId/complete')
    @ApiOperation({ summary: 'Mark a lesson as completed' })
    markLessonComplete(@CurrentUser('id') userId: string, @Param('lessonId') lessonId: string) {
        return this.enrollmentService.markLessonComplete(userId, lessonId);
    }
}
