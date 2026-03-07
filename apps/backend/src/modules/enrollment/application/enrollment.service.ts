import { Injectable, ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Tables } from '@infra/database/database.types';
import { EnrollmentRepository } from '../infrastructure/enrollment.repository';
import { EnrollmentWithCourse } from '../domain/enrollment.interface';

@Injectable()
export class EnrollmentService {
    constructor(
        private enrollmentRepository: EnrollmentRepository,
        private eventEmitter: EventEmitter2,
    ) { }

    async enroll(userId: string, courseId: string): Promise<Tables<'enrollments'>> {
        const existing = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);
        if (existing) {
            throw new ConflictException('Already enrolled in this course');
        }

        const enrollment = await this.enrollmentRepository.create(userId, courseId);
        await this.enrollmentRepository.incrementEnrollmentCount(courseId);
        return enrollment;
    }

    async unenroll(userId: string, courseId: string): Promise<{ message: string }> {
        await this.enrollmentRepository.delete(userId, courseId);
        return { message: 'Unenrolled successfully' };
    }

    async getMyEnrollments(userId: string): Promise<EnrollmentWithCourse[]> {
        return this.enrollmentRepository.findByUser(userId);
    }

    async updateProgress(
        userId: string,
        courseId: string,
        progressPercent: number,
        currentLessonId?: string,
    ): Promise<Tables<'enrollments'>> {
        return this.enrollmentRepository.updateProgress(userId, courseId, progressPercent, currentLessonId);
    }

    async markLessonComplete(
        userId: string,
        lessonId: string,
    ): Promise<Tables<'lesson_progress'>> {
        const result = await this.enrollmentRepository.upsertLessonProgress(userId, lessonId);

        // Get lesson type for XP calculation
        const lessonType = await this.enrollmentRepository.getLessonType(lessonId);

        // Emit event for gamification
        this.eventEmitter.emit('lesson.completed', {
            userId,
            lessonId,
            lessonType: lessonType ?? 'article',
        });

        // Track learning activity
        await this.enrollmentRepository.upsertLearningActivity(userId);

        return result;
    }

    async getEnrollment(userId: string, courseId: string) {
        return this.enrollmentRepository.findByUserAndCourse(userId, courseId);
    }

    async getLessonProgress(userId: string, lessonId: string) {
        return this.enrollmentRepository.getLessonProgress(userId, lessonId);
    }

    // ── Pinned Courses ───────────────────────────────────────────────

    async pinCourse(userId: string, courseId: string) {
        return this.enrollmentRepository.pinCourse(userId, courseId);
    }

    async unpinCourse(userId: string, courseId: string) {
        return this.enrollmentRepository.unpinCourse(userId, courseId);
    }

    async getPinnedCourses(userId: string) {
        return this.enrollmentRepository.getPinnedCourses(userId);
    }

    // ── Code Submission ──────────────────────────────────────────────

    async saveCodeSubmission(userId: string, lessonId: string, code: string) {
        return this.enrollmentRepository.saveCodeSubmission(userId, lessonId, code);
    }
}
