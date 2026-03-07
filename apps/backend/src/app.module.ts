import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './infrastructure/database/supabase.module';
import { EventBusModule } from './infrastructure/event-bus/event-bus.module';
import { LearningModule } from './modules/learning/learning.module';
import { IdentityModule } from './modules/identity/identity.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { ExecutionModule } from './modules/execution/execution.module';
import { AiModule } from './modules/ai/ai.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationModule } from './modules/notification/notification.module';
import { GamificationModule } from './modules/gamification/gamification.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Infrastructure
    SupabaseModule,
    EventBusModule,

    // Bounded Contexts (Business Modules)
    LearningModule,
    IdentityModule,
    EnrollmentModule,
    ExecutionModule,
    AiModule,
    AdminModule,
    NotificationModule,
    GamificationModule,
  ],
})
export class AppModule { }

