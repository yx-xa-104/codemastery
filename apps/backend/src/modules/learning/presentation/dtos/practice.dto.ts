import { IsString, IsOptional, IsEnum, IsArray, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePracticeDto {
    @ApiProperty({ example: 'Tìm số lớn nhất' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Viết hàm tìm số lớn nhất trong mảng...' })
    @IsString()
    description: string;

    @ApiPropertyOptional({ enum: ['easy', 'medium', 'hard'], default: 'easy' })
    @IsOptional()
    @IsEnum(['easy', 'medium', 'hard'])
    difficulty?: string;

    @ApiProperty({ example: 'javascript' })
    @IsString()
    language: string;

    @ApiPropertyOptional({ example: 'arrays' })
    @IsOptional()
    @IsString()
    category?: string;

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
    @IsArray()
    test_cases?: any[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    hints?: string[];
}

export class UpdatePracticeDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ enum: ['easy', 'medium', 'hard'] })
    @IsOptional()
    @IsEnum(['easy', 'medium', 'hard'])
    difficulty?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    language?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    category?: string;

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
    @IsArray()
    test_cases?: any[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    hints?: string[];
}

export class SubmitPracticeDto {
    @ApiProperty({ example: 'console.log(Math.max(...arr))' })
    @IsString()
    code: string;

    @ApiProperty({ example: 'javascript' })
    @IsString()
    language: string;
}
