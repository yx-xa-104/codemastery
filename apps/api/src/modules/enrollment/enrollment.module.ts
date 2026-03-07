import { Module } from '@nestjs/common';
import { AuthModule } from '@shared/auth';
import { EnrollmentController } from './controllers/enrollment.controller';
import { EnrollmentService } from './services/enrollment.service';
import { EnrollmentRepository } from './repositories/enrollment.repository';

@Module({
  imports: [AuthModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentRepository],
})
export class EnrollmentModule {}
