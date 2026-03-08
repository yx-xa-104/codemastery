import { Module } from '@nestjs/common';
import { CourseController } from './presentation/course.controller';
import { AdminCourseController } from './presentation/admin-course.controller';
import { LessonController } from './presentation/lesson.controller';
import { ModuleController } from './presentation/module.controller';
import { QuizController } from './presentation/quiz.controller';
import { ReviewController } from './presentation/review.controller';
import { CourseService } from './application/course.service';
import { AdminCourseService } from './application/admin-course.service';
import { LessonService } from './application/lesson.service';
import { ModuleService } from './application/module.service';
import { QuizService } from './application/quiz.service';
import { ReviewService } from './application/review.service';
import { CourseRepository } from './infrastructure/course.repository';
import { LessonRepository } from './infrastructure/lesson.repository';
import { ModuleRepository } from './infrastructure/module.repository';
import { QuizRepository } from './infrastructure/quiz.repository';
import { ReviewRepository } from './infrastructure/review.repository';

@Module({
    controllers: [CourseController, AdminCourseController, LessonController, ModuleController, QuizController, ReviewController],
    providers: [
        CourseService, AdminCourseService, LessonService, ModuleService, QuizService, ReviewService,
        CourseRepository, LessonRepository, ModuleRepository, QuizRepository, ReviewRepository,
    ],
    exports: [CourseService, LessonService],
})
export class LearningModule { }

