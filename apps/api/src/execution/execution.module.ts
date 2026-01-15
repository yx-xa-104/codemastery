import { Module } from '@nestjs/common';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';
import { DockerRunnerService } from './docker-runner.service';

@Module({
  controllers: [ExecutionController],
  providers: [ExecutionService, DockerRunnerService],
  exports: [ExecutionService],
})
export class ExecutionModule {}
