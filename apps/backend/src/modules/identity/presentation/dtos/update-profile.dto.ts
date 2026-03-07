import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiPropertyOptional({ description: 'Full name' })
    @IsOptional()
    @IsString()
    full_name?: string;

    @ApiPropertyOptional({ description: 'Bio' })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({ description: 'Avatar URL' })
    @IsOptional()
    @IsString()
    avatar_url?: string;

    @ApiPropertyOptional({ description: 'Date of birth (YYYY-MM-DD)' })
    @IsOptional()
    @IsString()
    date_of_birth?: string;

    @ApiPropertyOptional({ description: 'Student ID' })
    @IsOptional()
    @IsString()
    student_id?: string;

    @ApiPropertyOptional({ description: 'Class code' })
    @IsOptional()
    @IsString()
    class_code?: string;
}
