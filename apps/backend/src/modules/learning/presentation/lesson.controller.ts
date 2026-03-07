import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, RolesGuard, Roles } from '@common/index';
import { LessonService } from '../application/lesson.service';
import { CreateLessonDto, UpdateLessonDto } from './dtos/lesson.dto';

@ApiTags('lessons')
@Controller()
export class LessonController {
    constructor(private lessonService: LessonService) { }

    @Get('lessons/:courseSlug/:lessonSlug')
    @ApiOperation({ summary: 'Get lesson by course and lesson slug' })
    async findBySlug(
        @Param('courseSlug') courseSlug: string,
        @Param('lessonSlug') lessonSlug: string,
    ) {
        const lesson = await this.lessonService.findBySlug(courseSlug, lessonSlug);
        if (!lesson) throw new NotFoundException('Lesson not found');
        return lesson;
    }

    @Get('lessons/:lessonId/content')
    @ApiOperation({ summary: 'Get lesson content (HTML, code exercise)' })
    async getLessonContent(@Param('lessonId') lessonId: string) {
        return this.lessonService.getLessonContent(lessonId);
    }

    // ── CRUD ─────────────────────────────────────────────────────────

    @Post('modules/:moduleId/lessons')
    @ApiOperation({ summary: 'Create a lesson in a module (teacher/admin)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher', 'admin')
    create(@Param('moduleId') moduleId: string, @Body() body: CreateLessonDto) {
        return this.lessonService.create(moduleId, body as any);
    }

    @Patch('lessons/:id')
    @ApiOperation({ summary: 'Update a lesson (teacher/admin)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher', 'admin')
    update(@Param('id') id: string, @Body() body: UpdateLessonDto) {
        return this.lessonService.update(id, body as any);
    }

    @Delete('lessons/:id')
    @ApiOperation({ summary: 'Delete a lesson (teacher/admin)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher', 'admin')
    remove(@Param('id') id: string) {
        return this.lessonService.delete(id);
    }
}
