import { Controller, Get, Patch, Post, Body, UseGuards, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { SupabaseAuthGuard, CurrentUser } from '@common/index';
import { ProfileService } from '../application/profile.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) { }

    @Get()
    @ApiOperation({ summary: 'Get my profile' })
    getProfile(@CurrentUser('id') userId: string) {
        return this.profileService.getProfile(userId);
    }

    @Patch()
    @ApiOperation({ summary: 'Update my profile' })
    updateProfile(
        @CurrentUser('id') userId: string,
        @Body() body: UpdateProfileDto,
    ) {
        return this.profileService.updateProfile(userId, body);
    }

    @Post('avatar')
    @ApiOperation({ summary: 'Upload avatar image' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: { file: { type: 'string', format: 'binary' } },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(
        @CurrentUser('id') userId: string,
        @UploadedFile() file: any, // Multer file
    ) {
        if (!file) throw new BadRequestException('No file uploaded');

        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimes.includes(file.mimetype)) {
            throw new BadRequestException('Only JPEG, PNG, WebP, and GIF images are allowed');
        }

        if (file.size > 2 * 1024 * 1024) {
            throw new BadRequestException('File size must be under 2MB');
        }

        return this.profileService.uploadAvatar(userId, file);
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
