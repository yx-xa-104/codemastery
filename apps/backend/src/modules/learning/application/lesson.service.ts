import { Injectable } from '@nestjs/common';
import { Tables } from '@infra/database/database.types';
import { LessonRepository } from '../infrastructure/lesson.repository';
import { LessonWithModule, ModuleWithLessons } from '../domain/lesson.interface';

@Injectable()
export class LessonService {
    constructor(private lessonRepository: LessonRepository) { }

    async findBySlug(
        courseSlug: string,
        lessonSlug: string,
    ): Promise<LessonWithModule | null> {
        return this.lessonRepository.findBySlug(courseSlug, lessonSlug);
    }

    async getCourseLessons(courseId: string): Promise<ModuleWithLessons[]> {
        return this.lessonRepository.findModulesWithLessons(courseId);
    }

    async getLessonContent(lessonId: string): Promise<Tables<'lessons'>> {
        return this.lessonRepository.findContentById(lessonId);
    }
}
