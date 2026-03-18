import { IsString, IsOptional, IsEnum, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
    @ApiProperty({ example: 'Biến trong Python' })
    @IsString()
    title: string;

    @ApiPropertyOptional({ enum: ['article', 'code_exercise', 'quiz'] })
    @IsOptional()
    @IsEnum(['article', 'code_exercise', 'quiz'])
    lesson_type?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    content_html?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    duration_minutes?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    starter_code?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    solution_code?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    programming_language?: string;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    is_free_preview?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    sort_order?: number;
}

export class UpdateLessonDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ enum: ['article', 'code_exercise', 'quiz'] })
    @IsOptional()
    @IsEnum(['article', 'code_exercise', 'quiz'])
    lesson_type?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    content_html?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    duration_minutes?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    starter_code?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    solution_code?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    programming_language?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_free_preview?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    sort_order?: number;
}
