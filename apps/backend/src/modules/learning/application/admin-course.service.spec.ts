import { Test, TestingModule } from '@nestjs/testing';
import { AdminCourseService } from './admin-course.service';
import { CourseRepository } from '../infrastructure/course.repository';
import { NotFoundException } from '@nestjs/common';

const mockCourseRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
};

describe('AdminCourseService', () => {
    let service: AdminCourseService;
    let repo: typeof mockCourseRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminCourseService,
                { provide: CourseRepository, useValue: mockCourseRepository },
            ],
        }).compile();

        service = module.get<AdminCourseService>(AdminCourseService);
        repo = module.get(CourseRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('approve', () => {
        it('should mark course as published', async () => {
            repo.findById.mockResolvedValue({ id: 'c1' });
            repo.update.mockResolvedValue({ id: 'c1', status: 'published' });

            await service.approve('c1', 'a1');
            
            expect(repo.update).toHaveBeenCalledWith('c1', {
                status: 'published',
                moderated_by: 'a1',
                rejection_reason: null,
            });
        });

        it('should throw NotFoundException if course missing', async () => {
            repo.findById.mockResolvedValue(null);
            await expect(service.approve('c1', 'a1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('reject', () => {
        it('should mark course as rejected and save reason', async () => {
            repo.findById.mockResolvedValue({ id: 'c1' });
            repo.update.mockResolvedValue({ id: 'c1', status: 'rejected' });

            const reason = 'Nội dung phản cảm';
            await service.reject('c1', 'a1', reason);
            
            expect(repo.update).toHaveBeenCalledWith('c1', {
                status: 'rejected',
                moderated_by: 'a1',
                rejection_reason: reason,
            });
        });
    });

    describe('suspend', () => {
         it('should mark course as suspended', async () => {
             repo.findById.mockResolvedValue({ id: 'c1' });
             await service.suspend('c1', 'a1');
             expect(repo.update).toHaveBeenCalledWith('c1', expect.objectContaining({
                 status: 'suspended',
                 moderated_by: 'a1',
             }));
         });
    });
});
