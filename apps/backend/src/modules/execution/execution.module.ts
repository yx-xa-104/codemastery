import { Module } from '@nestjs/common';
import { ExecutionController } from './presentation/execution.controller';
import { ExecutionService } from './application/execution.service';

@Module({
  controllers: [ExecutionController],
  providers: [ExecutionService],
  exports: [ExecutionService],
})
export class ExecutionModule { }
