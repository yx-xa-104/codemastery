import { Controller, Post, Body, Sse, Req } from '@nestjs/common';
import { PicoclawService } from './picoclaw.service';
import { Observable } from 'rxjs';
import { Request } from 'express';

import { IsString, IsNotEmpty } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;
}

@Controller('picoclaw')
export class PicoclawController {
  constructor(private readonly picoclawService: PicoclawService) {}

  @Post('chat')
  @Sse()
  chatStream(
    @Body() body: ChatDto,
    @Req() req: Request,
  ): Observable<{ data: any }> {
    const abortController = new AbortController();

    // Listen to client disconnect
    req.on('close', () => {
      abortController.abort();
    });

    return this.picoclawService.chatStream(body.user_id, body.prompt, abortController.signal);
  }
}
