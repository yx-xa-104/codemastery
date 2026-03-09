import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExecuteCodeDto {
    @ApiProperty({
        description: 'Code to execute',
        example: 'print("Hello, World!")',
    })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        description: 'Programming language',
        example: 'python',
    })
    @IsString()
    @IsNotEmpty()
    language: string;

    @ApiPropertyOptional({
        description: 'Standard input for the program',
        example: '42',
    })
    @IsString()
    @IsOptional()
    stdin?: string;
}
