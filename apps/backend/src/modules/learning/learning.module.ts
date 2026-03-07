import { Module } from '@nestjs/common';
import { CourseController } from './presentation/course.controller';
import { LessonController } from './presentation/lesson.controller';
import { CourseService } from './application/course.service';
import { LessonService } from './application/lesson.service';
import { CourseRepository } from './infrastructure/course.repository';
import { LessonRepository } from './infrastructure/lesson.repository';

@Module({
    controllers: [CourseController, LessonController],
    providers: [CourseService, LessonService, CourseRepository, LessonRepository],
    exports: [CourseService, LessonService],
})
export class LearningModule { }
