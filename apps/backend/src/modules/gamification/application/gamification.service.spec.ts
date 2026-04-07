import { Test, TestingModule } from '@nestjs/testing';
import { GamificationService } from './gamification.service';
import { GamificationRepository } from '../infrastructure/gamification.repository';

// Mock repository
const mockGamificationRepository = {
    getLeaderboard: jest.fn(),
    getUserStats: jest.fn(),
    getAvailableBadges: jest.fn(),
    getUserBadges: jest.fn(),
    awardXp: jest.fn(),
    checkAndAwardBadges: jest.fn(),
};

describe('GamificationService', () => {
    let service: GamificationService;
    let repo: typeof mockGamificationRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GamificationService,
                {
                    provide: GamificationRepository,
                    useValue: mockGamificationRepository,
                },
            ],
        }).compile();

        service = module.get<GamificationService>(GamificationService);
        repo = module.get(GamificationRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Leaderboard', () => {
        it('should return mapped leaderboard with ranks', async () => {
            repo.getLeaderboard.mockResolvedValue([
                { id: '1', display_name: 'Alice', current_level: 5 },
                { id: '2', display_name: 'Bob', current_level: 3 },
            ]);

            const result = await service.getLeaderboard(10);
            expect(result).toHaveLength(2);
            expect(result[0].rank).toBe(1);
            expect(result[0].display_name).toBe('Alice');
            expect(result[1].rank).toBe(2);
        });
    });

    describe('handleLessonCompleted', () => {
        it('should award 10 XP for article', async () => {
            repo.awardXp.mockResolvedValue({ xpEarned: 10, streak: 1, current_xp: 10, target_xp: 100, level_up: false });
            repo.checkAndAwardBadges.mockResolvedValue([]);

            const result = await service.handleLessonCompleted({ userId: 'u1', lessonId: 'l1', lessonType: 'article' });
            
            expect(result.xpEarned).toBe(10);
            expect(repo.awardXp).toHaveBeenCalledWith('u1', 10);
            expect(repo.checkAndAwardBadges).toHaveBeenCalledWith('u1');
        });

        it('should award 25 XP for code_exercise', async () => {
            repo.awardXp.mockResolvedValue({ xpEarned: 25, streak: 1, current_xp: 25, target_xp: 100, level_up: false });
            repo.checkAndAwardBadges.mockResolvedValue([]);

            await service.handleLessonCompleted({ userId: 'u1', lessonId: 'l1', lessonType: 'code_exercise' });
            expect(repo.awardXp).toHaveBeenCalledWith('u1', 25);
        });

        it('should check for new badges upon completion', async () => {
             repo.awardXp.mockResolvedValue({ xpEarned: 30, streak: 5 });
             repo.checkAndAwardBadges.mockResolvedValue([{ id: 'b1', name: 'First Quiz' }]);

             await service.handleLessonCompleted({ userId: 'u1', lessonId: 'l1', lessonType: 'quiz' });
             expect(repo.checkAndAwardBadges).toHaveBeenCalledWith('u1');
        });
    });
    
    describe('handlePracticeAccepted', () => {
        it('should award 20 XP for solving a practice problem', async () => {
            repo.awardXp.mockResolvedValue({ xpEarned: 20 });
            repo.checkAndAwardBadges.mockResolvedValue([]);

            await service.handlePracticeAccepted({ userId: 'u1', problemId: 'p1' });
            expect(repo.awardXp).toHaveBeenCalledWith('u1', 20);
        });
    });
});
