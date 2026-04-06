import { Injectable, ForbiddenException } from '@nestjs/common';
import { Tables } from '@infra/database/database.types';
import { CourseRepository } from '../infrastructure/course.repository';
import { CourseWithCategory, ModuleWithLessons } from '../domain/course.interface';

const TEACHER_ALLOWED_STATUSES = ['draft', 'pending_review'];

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

    async findById(id: string): Promise<CourseWithCategory> {
        return this.courseRepository.findById(id);
    }

    async findModulesWithLessons(courseId: string): Promise<ModuleWithLessons[]> {
        return this.courseRepository.findModulesWithLessons(courseId);
    }

    async getCategories(): Promise<Tables<'categories'>[]> {
        return this.courseRepository.findAllCategories();
    }

    async findByTeacher(teacherId: string): Promise<CourseWithCategory[]> {
        return this.courseRepository.findByTeacher(teacherId);
    }

    // ── CRUD Operations ──────────────────────────────────────────────

    async create(courseData: Partial<Tables<'courses'>>) {
        return this.courseRepository.create(courseData);
    }

    async update(id: string, courseData: Partial<Tables<'courses'>>, userId: string, userRole?: string) {
        const course = await this.courseRepository.findById(id);
        const isAdmin = userRole === 'admin';
        const isOwner = (course as any).teacher_id === userId;

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException('Bạn không có quyền chỉnh sửa khóa học này');
        }

        // Teachers can only change status to draft or pending_review
        const newStatus = (courseData as any).status;
        if (newStatus && !isAdmin && !TEACHER_ALLOWED_STATUSES.includes(newStatus)) {
            throw new ForbiddenException('Giảng viên chỉ được phép lưu nháp hoặc gửi kiểm duyệt');
        }

        return this.courseRepository.update(id, courseData);
    }

    async delete(id: string, userId: string, userRole?: string) {
        const course = await this.courseRepository.findById(id);
        const isAdmin = userRole === 'admin';
        const isOwner = (course as any).teacher_id === userId;

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException('Bạn không có quyền xóa khóa học này');
        }
        return this.courseRepository.delete(id);
    }

    async search(query: string) {
        return this.courseRepository.search(query);
    }

    // ── Category CRUD ────────────────────────────────────────────────

    async createCategory(name: string, icon?: string, sortOrder?: number) {
        return this.courseRepository.createCategory(name, icon, sortOrder);
    }

    async updateCategory(id: string, updates: { name?: string; icon?: string; sort_order?: number }) {
        return this.courseRepository.updateCategory(id, updates);
    }

    async deleteCategory(id: string) {
        return this.courseRepository.deleteCategory(id);
    }
}
