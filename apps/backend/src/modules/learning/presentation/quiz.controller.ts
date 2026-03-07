import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard, RolesGuard, Roles } from '@common/index';
import { QuizService } from '../application/quiz.service';
import { CreateQuizQuestionDto, UpdateQuizQuestionDto } from './dtos/quiz.dto';

@ApiTags('quiz')
@Controller('lessons')
export class QuizController {
    constructor(private quizService: QuizService) { }

    @Get(':lessonId/quiz')
    @ApiOperation({ summary: 'Get quiz questions for a lesson' })
    findByLesson(@Param('lessonId') lessonId: string) {
        return this.quizService.findByLesson(lessonId);
    }

    @Post(':lessonId/quiz')
    @ApiOperation({ summary: 'Create a quiz question (teacher/admin)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher', 'admin')
    createQuestion(
        @Param('lessonId') lessonId: string,
        @Body() body: CreateQuizQuestionDto,
    ) {
        return this.quizService.createQuestion(
            lessonId,
            body.question_text,
            body.sort_order ?? 0,
            body.options,
        );
    }

    @Patch('quiz/:questionId')
    @ApiOperation({ summary: 'Update a quiz question (teacher/admin)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher', 'admin')
    updateQuestion(
        @Param('questionId') questionId: string,
        @Body() body: UpdateQuizQuestionDto,
    ) {
        return this.quizService.updateQuestion(
            questionId,
            { question_text: body.question_text, sort_order: body.sort_order },
            body.options,
        );
    }

    @Delete('quiz/:questionId')
    @ApiOperation({ summary: 'Delete a quiz question (teacher/admin)' })
    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('teacher', 'admin')
    deleteQuestion(@Param('questionId') questionId: string) {
        return this.quizService.deleteQuestion(questionId);
    }
}
