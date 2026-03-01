import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get(':courseSlug/:lessonSlug')
  @ApiOperation({ summary: 'Get lesson by course and lesson slug' })
  async findBySlug(@Param('courseSlug') courseSlug: string, @Param('lessonSlug') lessonSlug: string) {
    const lesson = await this.lessonsService.findBySlug(courseSlug, lessonSlug);
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  @Get(':lessonId/content')
  @ApiOperation({ summary: 'Get lesson content (MDX, video, exercise)' })
  async getLessonContent(@Param('lessonId') lessonId: string) {
    return this.lessonsService.getLessonContent(lessonId);
  }
}
