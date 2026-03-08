import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, CurrentUser } from '@common/index';
import { GamificationService } from '../application/gamification.service';

@ApiTags('gamification')
@Controller('gamification')
export class GamificationController {
    constructor(private gamificationService: GamificationService) { }

    @Get('leaderboard')
    @ApiOperation({ summary: 'Get XP leaderboard' })
    getLeaderboard(@Query('limit') limit?: string) {
        return this.gamificationService.getLeaderboard(limit ? parseInt(limit) : 20);
    }

    @Get('my-stats')
    @ApiOperation({ summary: 'Get my gamification stats (XP, streak, rank)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard)
    getMyStats(@CurrentUser('id') userId: string) {
        return this.gamificationService.getMyStats(userId);
    }

    @Get('badges')
    @ApiOperation({ summary: 'Get all available badges' })
    getAllBadges() {
        return this.gamificationService.getAllBadges();
    }

    @Get('my-badges')
    @ApiOperation({ summary: 'Get my earned badges' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard)
    getMyBadges(@CurrentUser('id') userId: string) {
        return this.gamificationService.getMyBadges(userId);
    }
}
