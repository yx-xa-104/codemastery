import { Controller, Post, Body, Get, Param, Delete, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PicoclawService } from './picoclaw.service';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsOptional()
  session_id?: string;

  @IsOptional()
  metadata?: any;
}

@Controller('picoclaw')
export class PicoclawController {
  constructor(private readonly picoclawService: PicoclawService) {}

  @Get('sessions')
  async getSessions(@Query('user_id') userId: string) {
    if (!userId) {
      return { status: 'error', message: 'Missing user_id' };
    }
    const data = await this.picoclawService.getSessions(userId);
    return { status: 'success', data };
  }

  @Get('sessions/:id/messages')
  async getMessages(@Param('id') sessionId: string) {
    const data = await this.picoclawService.getMessages(sessionId);
    return { status: 'success', data };
  }

  @Delete('sessions/:id')
  async deleteSession(@Param('id') sessionId: string) {
    const data = await this.picoclawService.deleteSession(sessionId);
    return { status: 'success', data };
  }

  @Post('chat')
  @Throttle({ default: { limit: 1, ttl: 5000 } })
  async chat(@Body() body: ChatDto) {
    const { reply, session_id } = await this.picoclawService.chat(body.user_id, body.prompt, body.session_id, body.metadata);
    return { status: 'success', reply, session_id };
  }
}
