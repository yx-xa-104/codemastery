import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
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
import { PicoclawModule } from './modules/picoclaw/picoclaw.module';
import { CommunityModule } from './modules/community/community.module';
import { CronModule } from './modules/cron/cron.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Cache module for global access
    CacheModule.register({
      isGlobal: true,
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100, // 100 requests per minute globally
      }
    ]),

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
    PicoclawModule,
    CommunityModule,
    ScheduleModule.forRoot(),
    CronModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ]
})
export class AppModule { }
