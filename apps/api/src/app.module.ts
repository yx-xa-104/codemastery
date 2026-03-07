import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './shared/database/supabase.module';
import { AuthModule } from './shared/auth/auth.module';
import { CourseModule } from './modules/course/course.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ExecutionModule } from './modules/execution/execution.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupabaseModule,
    AuthModule,
    CourseModule,
    LessonModule,
    EnrollmentModule,
    ProfileModule,
    ExecutionModule,
    AiModule,
  ],
})
export class AppModule {}
