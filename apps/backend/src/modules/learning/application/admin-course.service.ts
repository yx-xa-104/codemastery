import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from '../infrastructure/course.repository';
import { CourseWithCategory } from '../domain/course.interface';
import { NotificationService } from '../../notification/application/notification.service';

@Injectable()
export class AdminCourseService {
    constructor(
        private courseRepository: CourseRepository,
        private notificationService: NotificationService,
    ) { }

    async findAll(status?: string): Promise<CourseWithCategory[]> {
        return this.courseRepository.findAll(status ? { status } : undefined);
    }

    async approve(courseId: string, adminId: string) {
        const course = await this.ensureExists(courseId);
        const result = await this.courseRepository.update(courseId, {
            status: 'published' as any,
            moderated_by: adminId,
            rejection_reason: null,
        } as any);

        await this.notificationService.create(
            course.teacher_id,
            'Khóa học đã được duyệt',
            `Khóa học "${course.title}" của bạn đã được admin duyệt và xuất bản thành công!`,
            'system',
            `/courses/${course.slug}`
        );

        return result;
    }

    async reject(courseId: string, adminId: string, reason: string) {
        const course = await this.ensureExists(courseId);
        const result = await this.courseRepository.update(courseId, {
            status: 'rejected' as any,
            moderated_by: adminId,
            rejection_reason: reason,
        } as any);

        await this.notificationService.create(
            course.teacher_id,
            'Khóa học bị từ chối',
            `Khóa học "${course.title}" của bạn đã bị từ chối với lý do: "${reason}". Vui lòng chỉnh sửa và gửi lại.`,
            'system',
            `/teacher/courses`
        );

        return result;
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
