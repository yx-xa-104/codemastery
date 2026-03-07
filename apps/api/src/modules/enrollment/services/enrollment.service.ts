import { Injectable, ConflictException } from '@nestjs/common';
import { Tables } from '@shared/database/database.types';
import { EnrollmentRepository } from '../repositories/enrollment.repository';
import { EnrollmentWithCourse } from '../interfaces/enrollment.interface';

@Injectable()
export class EnrollmentService {
  constructor(private enrollmentRepository: EnrollmentRepository) {}

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
    return this.enrollmentRepository.upsertLessonProgress(userId, lessonId);
  }
}
