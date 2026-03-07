import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, CurrentUser } from '@common/index';
import { ReviewService } from '../application/review.service';
import { CreateReviewDto, UpdateReviewDto } from './dtos/review.dto';

@ApiTags('reviews')
@Controller('courses')
export class ReviewController {
    constructor(private reviewService: ReviewService) { }

    @Get(':courseId/reviews')
    @ApiOperation({ summary: 'Get reviews for a course' })
    findByCourse(@Param('courseId') courseId: string) {
        return this.reviewService.findByCourse(courseId);
    }

    @Post(':courseId/reviews')
    @ApiOperation({ summary: 'Create a review (enrolled users only)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard)
    create(
        @CurrentUser('id') userId: string,
        @Param('courseId') courseId: string,
        @Body() body: CreateReviewDto,
    ) {
        return this.reviewService.create(userId, courseId, body.rating, body.comment);
    }

    @Patch('reviews/:id')
    @ApiOperation({ summary: 'Update own review' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard)
    update(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() body: UpdateReviewDto,
    ) {
        return this.reviewService.update(id, userId, body);
    }

    @Delete('reviews/:id')
    @ApiOperation({ summary: 'Delete own review' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard)
    remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.reviewService.delete(id, userId);
    }
}
