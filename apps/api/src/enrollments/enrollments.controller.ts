import { Controller, Post, Delete, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/decorators';

@ApiTags('enrollments')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my enrolled courses' })
  getMyEnrollments(@CurrentUser('id') userId: string) {
    return this.enrollmentsService.getMyEnrollments(userId);
  }

  @Post(':courseId')
  @ApiOperation({ summary: 'Enroll in a course' })
  enroll(@CurrentUser('id') userId: string, @Param('courseId') courseId: string) {
    return this.enrollmentsService.enroll(userId, courseId);
  }

  @Delete(':courseId')
  @ApiOperation({ summary: 'Unenroll from a course' })
  unenroll(@CurrentUser('id') userId: string, @Param('courseId') courseId: string) {
    return this.enrollmentsService.unenroll(userId, courseId);
  }

  @Patch(':courseId/progress')
  @ApiOperation({ summary: 'Update course progress' })
  updateProgress(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
    @Body() body: { progressPercent: number; currentLessonId?: string },
  ) {
    return this.enrollmentsService.updateProgress(userId, courseId, body.progressPercent, body.currentLessonId);
  }

  @Post('lessons/:lessonId/complete')
  @ApiOperation({ summary: 'Mark a lesson as completed' })
  markLessonComplete(@CurrentUser('id') userId: string, @Param('lessonId') lessonId: string) {
    return this.enrollmentsService.markLessonComplete(userId, lessonId);
  }
}
