import { Module } from '@nestjs/common';
import { EnrollmentController } from './presentation/enrollment.controller';
import { RoadmapController } from './presentation/roadmap.controller';
import { EnrollmentService } from './application/enrollment.service';
import { RoadmapService } from './application/roadmap.service';
import { EnrollmentRepository } from './infrastructure/enrollment.repository';

@Module({
  controllers: [EnrollmentController, RoadmapController],
  providers: [EnrollmentService, EnrollmentRepository, RoadmapService],
  exports: [EnrollmentService, EnrollmentRepository, RoadmapService],
})
export class EnrollmentModule { }
