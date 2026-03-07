import { Module } from '@nestjs/common';
import { ExecutionController } from './controllers/execution.controller';
import { ExecutionService } from './services/execution.service';
import { DockerRunnerService } from './services/docker-runner.service';

@Module({
  controllers: [ExecutionController],
  providers: [ExecutionService, DockerRunnerService],
  exports: [ExecutionService],
})
export class ExecutionModule {}
