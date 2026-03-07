import { IsString, IsOptional, IsBoolean, IsInt, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateQuizOptionDto {
    @ApiProperty({ example: 'print()' })
    @IsString()
    option_text: string;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    is_correct?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    sort_order?: number;
}

export class CreateQuizQuestionDto {
    @ApiProperty({ example: 'Hàm nào dùng để in ra màn hình trong Python?' })
    @IsString()
    question_text: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    sort_order?: number;

    @ApiProperty({ type: [CreateQuizOptionDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuizOptionDto)
    options: CreateQuizOptionDto[];
}

export class UpdateQuizQuestionDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    question_text?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    sort_order?: number;

    @ApiPropertyOptional({ type: [CreateQuizOptionDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuizOptionDto)
    options?: CreateQuizOptionDto[];
}
