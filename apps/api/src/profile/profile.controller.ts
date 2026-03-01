import { Controller, Get, Patch, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/decorators';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get my profile' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.profileService.getProfile(userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update my profile' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: { full_name?: string; bio?: string; avatar_url?: string; date_of_birth?: string; student_id?: string; class_code?: string },
  ) {
    return this.profileService.updateProfile(userId, body);
  }

  @Get('badges')
  @ApiOperation({ summary: 'Get my badges' })
  getMyBadges(@CurrentUser('id') userId: string) {
    return this.profileService.getMyBadges(userId);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get my learning activity' })
  getLearningActivity(@CurrentUser('id') userId: string, @Query('days') days?: string) {
    return this.profileService.getLearningActivity(userId, days ? parseInt(days) : 30);
  }
}
