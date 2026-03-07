import { Injectable } from '@nestjs/common';
import { Tables } from '@infra/database/database.types';
import { CourseRepository } from '../infrastructure/course.repository';
import { CourseWithCategory, ModuleWithLessons } from '../domain/course.interface';

@Injectable()
export class CourseService {
    constructor(private courseRepository: CourseRepository) { }

    async findAll(filters?: {
        status?: string;
        categoryId?: string;
        level?: string;
    }): Promise<CourseWithCategory[]> {
        return this.courseRepository.findAll(filters);
    }

    async findBySlug(slug: string): Promise<CourseWithCategory> {
        return this.courseRepository.findBySlug(slug);
    }

    async findModulesWithLessons(courseId: string): Promise<ModuleWithLessons[]> {
        return this.courseRepository.findModulesWithLessons(courseId);
    }

    async getCategories(): Promise<Tables<'categories'>[]> {
        return this.courseRepository.findAllCategories();
    }
}
