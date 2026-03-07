import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindCoursesDto {
    @ApiPropertyOptional({
        description: 'Filter by course status',
        enum: ['draft', 'published', 'archived'],
    })
    @IsOptional()
    @IsString()
    @IsIn(['draft', 'published', 'archived'])
    status?: string;

    @ApiPropertyOptional({ description: 'Filter by category ID' })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiPropertyOptional({
        description: 'Filter by difficulty level',
        enum: ['beginner', 'intermediate', 'advanced'],
    })
    @IsOptional()
    @IsString()
    @IsIn(['beginner', 'intermediate', 'advanced'])
    level?: string;
}
