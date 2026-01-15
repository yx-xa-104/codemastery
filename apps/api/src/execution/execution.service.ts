import { Injectable, Logger } from '@nestjs/common';
import { DockerRunnerService } from './docker-runner.service';

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
}

@Injectable()
export class ExecutionService {
  private readonly logger = new Logger(ExecutionService.name);

  constructor(private readonly dockerRunner: DockerRunnerService) {}

  async executeCode(code: string, language: string): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Validate input
      this.validateCode(code, language);

      // Execute in Docker container
      const result = await this.dockerRunner.runCode(code, language);

      const executionTime = Date.now() - startTime;

      return {
        output: result.stdout,
        error: result.stderr || undefined,
        executionTime,
      };
    } catch (error) {
      this.logger.error(`Execution failed: ${error.message}`);
      return {
        output: '',
        error: error.message,
        executionTime: Date.now() - startTime,
      };
    }
  }

  private validateCode(code: string, language: string): void {
    // Size limit
    if (code.length > 10000) {
      throw new Error('Code too long (max 10KB)');
    }

    // Supported languages
    const supportedLanguages = ['python', 'java', 'cpp', 'javascript'];
    if (!supportedLanguages.includes(language)) {
      throw new Error(`Unsupported language: ${language}`);
    }

    // Blacklist dangerous patterns
    const blacklist = {
      python: [
        /import\s+os/,
        /import\s+subprocess/,
        /import\s+sys/,
        /__import__/,
        /eval\(/,
        /exec\(/,
      ],
      javascript: [
        /require\s*\(\s*['"]child_process['"]/,
        /require\s*\(\s*['"]fs['"]/,
        /eval\(/,
        /Function\(/,
      ],
    };

    const patterns = blacklist[language] || [];
    for (const pattern of patterns) {
      if (pattern.test(code)) {
        throw new Error(`Forbidden pattern detected`);
      }
    }
  }
}
