import { Module } from '@nestjs/common';
import { ClassroomController } from './presentation/classroom.controller';
import { ClassroomService } from './application/classroom.service';
import { ClassroomRepository } from './infrastructure/classroom.repository';
import { LearningModule } from '../learning/learning.module';
import { NotificationModule } from '../notification/notification.module';
import { IdentityModule } from '../identity/identity.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';

@Module({
    imports: [LearningModule, NotificationModule, IdentityModule, EnrollmentModule],
    controllers: [ClassroomController],
    providers: [ClassroomService, ClassroomRepository],
    exports: [ClassroomService]
})
export class CommunityModule { }
