import { Injectable, Logger } from '@nestjs/common';
import { ExecutionResult } from '../domain/execution-result.interface';

@Injectable()
export class ExecutionService {
    private readonly logger = new Logger(ExecutionService.name);

    async executeCode(code: string, language: string): Promise<ExecutionResult> {
        const startTime = Date.now();

        try {
            this.validateCode(code, language);

            // TODO: Implement code execution backend (e.g. serverless, WASM, or external API)
            this.logger.warn('Code execution backend not yet implemented');

            return {
                output: '',
                error: 'Code execution is not yet configured. Please set up an execution backend.',
                executionTime: Date.now() - startTime,
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
        if (code.length > 10000) {
            throw new Error('Code too long (max 10KB)');
        }

        const supportedLanguages = ['python', 'java', 'cpp', 'javascript'];
        if (!supportedLanguages.includes(language)) {
            throw new Error(`Unsupported language: ${language}`);
        }

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
