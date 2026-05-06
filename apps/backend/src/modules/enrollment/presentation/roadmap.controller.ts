import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, CurrentUser } from '@common/index';
import { RoadmapService } from '../application/roadmap.service';

@ApiTags('Roadmap')
@Controller('roadmap')
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth()
export class RoadmapController {
    constructor(private readonly roadmapService: RoadmapService) {}

    @Get('personalized')
    @ApiOperation({ summary: 'Lấy lộ trình học cá nhân hóa cho sinh viên' })
    async getPersonalizedRoadmap(@CurrentUser('id') userId: string) {
        return this.roadmapService.getPersonalizedRoadmap(userId);
    }
}
