import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, RolesGuard, Roles, CurrentUser } from '@common/index';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PracticeService } from '../application/practice.service';
import { CreatePracticeDto, UpdatePracticeDto, SubmitPracticeDto } from './dtos/practice.dto';

@ApiTags('practice')
@Controller('practice')
export class PracticeController {
    constructor(
        private practiceService: PracticeService,
        private eventEmitter: EventEmitter2,
    ) { }

    @Get()
    @ApiOperation({ summary: 'List practice problems (with optional filters)' })
    findAll(
        @Query('difficulty') difficulty?: string,
        @Query('language') language?: string,
        @Query('category') category?: string,
        @Query('search') search?: string,
    ) {
        return this.practiceService.findAll({ difficulty, language, category, search });
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get a practice problem by slug' })
    findBySlug(@Param('slug') slug: string) {
        return this.practiceService.findBySlug(slug);
    }

    @Post()
    @ApiOperation({ summary: 'Create a practice problem (teacher)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher')
    create(@CurrentUser('id') userId: string, @Body() body: CreatePracticeDto) {
        return this.practiceService.create(body, userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a practice problem (teacher)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher')
    update(@Param('id') id: string, @Body() body: UpdatePracticeDto) {
        return this.practiceService.update(id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a practice problem (teacher)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher')
    remove(@Param('id') id: string) {
        return this.practiceService.delete(id);
    }

    @Post(':id/submit')
    @ApiOperation({ summary: 'Submit a solution for a practice problem' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard)
    async submit(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @Body() body: SubmitPracticeDto,
    ) {
        // The frontend runs tests via Piston and sends results
        // For now, we just record the submission. Tests are run client-side.
        // We trust the client for test results (same pattern as lesson completion)
        const testsPassedHeader = 0; // Will be sent from frontend
        const testsTotalHeader = 0;

        const result = await this.practiceService.submit(
            id, userId, body.code, body.language,
            { passed: testsPassedHeader, total: testsTotalHeader },
        );

        // Award XP for first correct submission
        if (result.isFirstAccept) {
            this.eventEmitter.emit('practice.accepted', {
                userId,
                problemId: id,
            });
        }

        return result;
    }

    @Post(':id/submit-result')
    @ApiOperation({ summary: 'Submit test results for a practice problem' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard)
    async submitResult(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @Body() body: { code: string; language: string; tests_passed: number; tests_total: number },
    ) {
        const result = await this.practiceService.submit(
            id, userId, body.code, body.language,
            { passed: body.tests_passed, total: body.tests_total },
        );

        if (result.isFirstAccept) {
            this.eventEmitter.emit('practice.accepted', {
                userId,
                problemId: id,
            });
        }

        return result;
    }

    @Get(':id/submissions')
    @ApiOperation({ summary: 'Get user submissions for a problem' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard)
    getSubmissions(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.practiceService.getUserSubmissions(userId, id);
    }
}
