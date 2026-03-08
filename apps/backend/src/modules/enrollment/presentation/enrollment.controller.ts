import { Controller, Post, Delete, Get, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
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

    @Get('courses/:courseId/status')
    @ApiOperation({ summary: 'Get enrollment status for a course' })
    async getCourseStatus(@CurrentUser('id') userId: string, @Param('courseId') courseId: string) {
        const enrollment = await this.enrollmentService.getEnrollment(userId, courseId);
        return { enrollmentId: enrollment ? enrollment.id : null };
    }

    @Get('lessons/:lessonId/progress')
    @ApiOperation({ summary: 'Get lesson progress status' })
    getLessonProgress(@CurrentUser('id') userId: string, @Param('lessonId') lessonId: string) {
        return this.enrollmentService.getLessonProgress(userId, lessonId);
    }

    // ── Pinned Courses ───────────────────────────────────────────────

    @Post('pin/:courseId')
    @ApiOperation({ summary: 'Pin a course' })
    pinCourse(@CurrentUser('id') userId: string, @Param('courseId') courseId: string) {
        return this.enrollmentService.pinCourse(userId, courseId);
    }

    @Delete('pin/:courseId')
    @ApiOperation({ summary: 'Unpin a course' })
    unpinCourse(@CurrentUser('id') userId: string, @Param('courseId') courseId: string) {
        return this.enrollmentService.unpinCourse(userId, courseId);
    }

    @Get('pinned')
    @ApiOperation({ summary: 'Get pinned courses' })
    getPinnedCourses(@CurrentUser('id') userId: string) {
        return this.enrollmentService.getPinnedCourses(userId);
    }

    // ── Learning Activity ────────────────────────────────────────────

    @Get('activity')
    @ApiOperation({ summary: 'Get learning activity for the past N days' })
    getLearningActivity(
        @CurrentUser('id') userId: string,
        @Query('days') days?: string,
    ) {
        return this.enrollmentService.getLearningActivity(userId, parseInt(days || '7', 10));
    }

    // ── Code Submission ──────────────────────────────────────────────

    @Patch('lessons/:lessonId/submission')
    @ApiOperation({ summary: 'Save code submission for a lesson' })
    saveCodeSubmission(
        @CurrentUser('id') userId: string,
        @Param('lessonId') lessonId: string,
        @Body('code') code: string,
    ) {
        return this.enrollmentService.saveCodeSubmission(userId, lessonId, code);
    }
}
