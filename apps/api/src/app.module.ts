import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExecutionModule } from './execution/execution.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ExecutionModule,
    AiModule,
    AuthModule,
    LessonsModule,
  ],
})
export class AppModule {}
