import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GamificationRepository } from '../infrastructure/gamification.repository';

// XP values by lesson type
const XP_TABLE: Record<string, number> = {
    article: 10,
    code_exercise: 25,
    quiz: 30,
};

@Injectable()
export class GamificationService {
    private readonly logger = new Logger(GamificationService.name);

    constructor(private gamificationRepository: GamificationRepository) { }

    async getLeaderboard(limit = 20) {
        const leaders = await this.gamificationRepository.getLeaderboard(limit);
        return leaders.map((leader: any, index: number) => ({
            rank: index + 1,
            ...leader,
        }));
    }

    async getMyStats(userId: string) {
        return this.gamificationRepository.getUserStats(userId);
    }

    async getAllBadges() {
        return this.gamificationRepository.getAvailableBadges();
    }

    async getMyBadges(userId: string) {
        return this.gamificationRepository.getUserBadges(userId);
    }

    @OnEvent('lesson.completed')
    async handleLessonCompleted(payload: { userId: string; lessonId: string; lessonType: string }) {
        const { userId, lessonType } = payload;

        const xpAmount = XP_TABLE[lessonType] ?? 10;
        const result = await this.gamificationRepository.awardXp(userId, xpAmount);

        this.logger.log(`Awarded ${result.xpEarned} XP to user ${userId} (type: ${lessonType}, streak: ${result.streak})`);

        // Check and award badges
        const newBadges = await this.gamificationRepository.checkAndAwardBadges(userId);
        if (newBadges.length > 0) {
            this.logger.log(`User ${userId} earned ${newBadges.length} new badge(s)`);
        }

        return result;
    }

    @OnEvent('practice.accepted')
    async handlePracticeAccepted(payload: { userId: string; problemId: string }) {
        const { userId } = payload;
        const xpAmount = 20; // XP for solving a practice problem

        const result = await this.gamificationRepository.awardXp(userId, xpAmount);
        this.logger.log(`Awarded ${xpAmount} XP to user ${userId} for practice problem`);

        const newBadges = await this.gamificationRepository.checkAndAwardBadges(userId);
        if (newBadges.length > 0) {
            this.logger.log(`User ${userId} earned ${newBadges.length} new badge(s)`);
        }

        return result;
    }
}
