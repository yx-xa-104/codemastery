import { Module } from '@nestjs/common';
import { EnrollmentController } from './presentation/enrollment.controller';
import { EnrollmentService } from './application/enrollment.service';
import { EnrollmentRepository } from './infrastructure/enrollment.repository';

@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentRepository],
  exports: [EnrollmentService],
})
export class EnrollmentModule { }
