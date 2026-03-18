import { IsString, IsOptional, IsEnum, IsBoolean, IsArray, IsUUID, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
    @ApiProperty({ example: 'Python Cơ bản' })
    @IsString()
    title: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    short_description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    category_id?: string;

    @ApiPropertyOptional({ enum: ['beginner', 'intermediate', 'advanced'] })
    @IsOptional()
    @IsEnum(['beginner', 'intermediate', 'advanced'])
    level?: string;

    @ApiPropertyOptional({ default: 'vi' })
    @IsOptional()
    @IsString()
    language?: string;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    is_free?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    thumbnail_url?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    trailer_url?: string;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    requirements?: string[];

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    learning_outcomes?: string[];
}
