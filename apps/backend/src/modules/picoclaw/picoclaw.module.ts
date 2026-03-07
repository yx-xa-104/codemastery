import { Module } from '@nestjs/common';
import { PicoclawController } from './picoclaw.controller';
import { PicoclawService } from './picoclaw.service';

@Module({
  controllers: [PicoclawController],
  providers: [PicoclawService],
  exports: [PicoclawService],
})
export class PicoclawModule {}
