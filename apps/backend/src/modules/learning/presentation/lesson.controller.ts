import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LessonService } from '../application/lesson.service';

@ApiTags('lessons')
@Controller('lessons')
export class LessonController {
    constructor(private lessonService: LessonService) { }

    @Get(':courseSlug/:lessonSlug')
    @ApiOperation({ summary: 'Get lesson by course and lesson slug' })
    async findBySlug(
        @Param('courseSlug') courseSlug: string,
        @Param('lessonSlug') lessonSlug: string,
    ) {
        const lesson = await this.lessonService.findBySlug(courseSlug, lessonSlug);
        if (!lesson) throw new NotFoundException('Lesson not found');
        return lesson;
    }

    @Get(':lessonId/content')
    @ApiOperation({ summary: 'Get lesson content (MDX, video, exercise)' })
    async getLessonContent(@Param('lessonId') lessonId: string) {
        return this.lessonService.getLessonContent(lessonId);
    }
}
