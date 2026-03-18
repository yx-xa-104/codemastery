import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    @ApiPropertyOptional({ enum: ['draft', 'published', 'archived', 'pending_review', 'rejected', 'suspended'] })
    @IsOptional()
    @IsEnum(['draft', 'published', 'archived', 'pending_review', 'rejected', 'suspended'])
    status?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_featured?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_hot?: boolean;
}
