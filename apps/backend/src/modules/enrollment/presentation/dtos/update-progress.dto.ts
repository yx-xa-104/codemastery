import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProgressDto {
    @ApiProperty({ description: 'Progress percentage', minimum: 0, maximum: 100 })
    @IsNumber()
    @Min(0)
    @Max(100)
    progressPercent: number;

    @ApiPropertyOptional({ description: 'Current lesson ID' })
    @IsOptional()
    @IsString()
    currentLessonId?: string;
}
