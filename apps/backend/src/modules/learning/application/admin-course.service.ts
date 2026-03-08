import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from '../infrastructure/course.repository';
import { CourseWithCategory } from '../domain/course.interface';

@Injectable()
export class AdminCourseService {
    constructor(private courseRepository: CourseRepository) { }

    async findAll(status?: string): Promise<CourseWithCategory[]> {
        return this.courseRepository.findAll(status ? { status } : undefined);
    }

    async approve(courseId: string, adminId: string) {
        await this.ensureExists(courseId);
        return this.courseRepository.update(courseId, {
            status: 'published' as any,
            moderated_by: adminId,
            rejection_reason: null,
        } as any);
    }

    async reject(courseId: string, adminId: string, reason: string) {
        await this.ensureExists(courseId);
        return this.courseRepository.update(courseId, {
            status: 'rejected' as any,
            moderated_by: adminId,
            rejection_reason: reason,
        } as any);
    }

    async suspend(courseId: string, adminId: string) {
        await this.ensureExists(courseId);
        return this.courseRepository.update(courseId, {
            status: 'suspended' as any,
            moderated_by: adminId,
            suspended_at: new Date().toISOString(),
        } as any);
    }

    async unpublish(courseId: string, adminId: string) {
        await this.ensureExists(courseId);
        return this.courseRepository.update(courseId, {
            status: 'draft' as any,
            moderated_by: adminId,
            suspended_at: null,
        } as any);
    }

    async transferOwnership(courseId: string, newTeacherId: string) {
        await this.ensureExists(courseId);
        return this.courseRepository.update(courseId, {
            teacher_id: newTeacherId,
        } as any);
    }

    async assignCategory(courseId: string, categoryId: string) {
        await this.ensureExists(courseId);
        return this.courseRepository.update(courseId, {
            category_id: categoryId,
        } as any);
    }

    private async ensureExists(courseId: string) {
        const course = await this.courseRepository.findById(courseId);
        if (!course) throw new NotFoundException('Khóa học không tồn tại');
        return course;
    }
}
