import { Module } from '@nestjs/common';
import { GamificationController } from './presentation/gamification.controller';
import { GamificationService } from './application/gamification.service';
import { GamificationRepository } from './infrastructure/gamification.repository';

@Module({
    controllers: [GamificationController],
    providers: [GamificationService, GamificationRepository],
    exports: [GamificationService],
})
export class GamificationModule { }
