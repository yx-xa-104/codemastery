import { Injectable, NotFoundException } from '@nestjs/common';
import { PracticeRepository } from '../infrastructure/practice.repository';

@Injectable()
export class PracticeService {
    constructor(private repo: PracticeRepository) { }

    async findAll(filters?: { difficulty?: string; language?: string; category?: string; search?: string }) {
        return this.repo.findAll(filters);
    }

    async findBySlug(slug: string) {
        const problem = await this.repo.findBySlug(slug);
        if (!problem) throw new NotFoundException('Bài tập không tồn tại');
        return problem;
    }

    async create(data: any, userId: string) {
        return this.repo.create({ ...data, created_by: userId });
    }

    async update(id: string, data: any) {
        return this.repo.update(id, data);
    }

    async delete(id: string) {
        return this.repo.delete(id);
    }

    async submit(problemId: string, userId: string, code: string, language: string, testResults: { passed: number; total: number }) {
        const status = testResults.passed === testResults.total ? 'accepted' : 'wrong_answer';

        // Check if user already solved this (to avoid duplicate XP)
        const alreadySolved = await this.repo.hasUserSolved(userId, problemId);

        const submission = await this.repo.createSubmission({
            user_id: userId,
            problem_id: problemId,
            code,
            language,
            status,
            tests_passed: testResults.passed,
            tests_total: testResults.total,
        });

        // Increment problem stats
        await this.repo.incrementSubmissions(problemId, status === 'accepted');

        return {
            ...submission,
            isFirstAccept: status === 'accepted' && !alreadySolved,
        };
    }

    async getUserSubmissions(userId: string, problemId: string) {
        return this.repo.getUserSubmissions(userId, problemId);
    }

    async hasUserSolved(userId: string, problemId: string) {
        return this.repo.hasUserSolved(userId, problemId);
    }
}
