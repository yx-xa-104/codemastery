import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    @ApiPropertyOptional({ enum: ['draft', 'published', 'archived'] })
    @IsOptional()
    @IsEnum(['draft', 'published', 'archived'])
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
