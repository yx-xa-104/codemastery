import { Injectable, Logger } from '@nestjs/common';
import { ExecutionResult } from '../domain/execution-result.interface';

@Injectable()
export class ExecutionService {
    private readonly logger = new Logger(ExecutionService.name);

    async executeCode(code: string, language: string): Promise<ExecutionResult> {
        const startTime = Date.now();

        try {
            this.validateCode(code, language);

            // Map user-friendly language names to Piston language identifiers
            const languageMap: Record<string, string> = {
                'java': 'java',
                'cpp': 'cpp',
                'csharp': 'csharp',
                'php': 'php',
                'pascal': 'pascal',
                'postgresql': 'postgresql',
                'mysql': 'mysql',
                'sqlserver': 'sqlserver',
                'typescript': 'typescript',
            };

            const pistonLang = languageMap[language.toLowerCase()];
            if (!pistonLang) {
                return {
                    output: '',
                    error: `Language ${language} is not supported by the remote execution engine.`,
                    executionTime: 0,
                };
            }

            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: pistonLang,
                    version: '*', // Sử dụng phiên bản mới nhất khả dụng
                    files: [
                        {
                            content: code,
                        }
                    ],
                    compile_timeout: 10000,
                    run_timeout: 10000,
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(`Piston API Error: ${errData.message || response.statusText}`);
            }

            const data = await response.json();

            let runOutput = data.run?.output || '';
            let runError = data.run?.stderr || '';

            // Nếu vòng compile bị lỗi
            if (data.compile?.code !== 0 && data.compile?.stderr) {
                runError = `Compilation Error:\n${data.compile.stderr}\n\n${runError}`;
            }

            return {
                output: runOutput,
                error: runError ? runError : undefined,
                executionTime: Date.now() - startTime,
            };
        } catch (error: any) {
            this.logger.error(`Execution failed: ${error.message}`);
            return {
                output: '',
                error: error.message,
                executionTime: Date.now() - startTime,
            };
        }
    }

    private validateCode(code: string, language: string): void {
        if (!code || code.length > 20000) {
            throw new Error('Code is too long or empty (max 20KB)');
        }

    }
}
