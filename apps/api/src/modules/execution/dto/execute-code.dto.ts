import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    enum: ['python', 'javascript', 'java', 'cpp'],
  })
  @IsString()
  @IsIn(['python', 'javascript', 'java', 'cpp'])
  language: string;
}
