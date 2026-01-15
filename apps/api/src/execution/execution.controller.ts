import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExecutionService } from './execution.service';
import { ExecuteCodeDto } from './dto/execute-code.dto';

@ApiTags('execution')
@Controller('api/execute')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post()
  @ApiOperation({ summary: 'Execute code in a sandboxed environment' })
  @ApiResponse({ status: 200, description: 'Code executed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async executeCode(@Body() dto: ExecuteCodeDto) {
    try {
      const result = await this.executionService.executeCode(
        dto.code,
        dto.language,
      );
      return result;
    } catch (error) {
      throw new HttpException(
        {
          error: 'Code execution failed',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
