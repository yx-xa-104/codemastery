import { Injectable, ForbiddenException } from '@nestjs/common';
import { ReviewRepository } from '../infrastructure/review.repository';

@Injectable()
export class ReviewService {
    constructor(private reviewRepository: ReviewRepository) { }

    async findByCourse(courseId: string) {
        return this.reviewRepository.findByCourse(courseId);
    }

    async create(userId: string, courseId: string, rating: number, comment?: string) {
        const enrolled = await this.reviewRepository.isEnrolled(userId, courseId);
        if (!enrolled) {
            throw new ForbiddenException('You must be enrolled to review this course');
        }
        return this.reviewRepository.create(userId, courseId, rating, comment);
    }

    async update(id: string, userId: string, updates: { rating?: number; comment?: string }) {
        return this.reviewRepository.update(id, userId, updates);
    }

    async delete(id: string, userId: string) {
        return this.reviewRepository.delete(id, userId);
    }
}
