import { Injectable, Logger } from '@nestjs/common';
import * as Docker from 'dockerode';
import { v4 as uuidv4 } from 'uuid';

interface RunResult {
  stdout: string;
  stderr: string;
}

@Injectable()
export class DockerRunnerService {
  private readonly logger = new Logger(DockerRunnerService.name);
  private readonly docker: Docker;

  // Docker image mapping for each language
  private readonly languageImages = {
    python: 'python:3.11-alpine',
    java: 'openjdk:17-alpine',
    cpp: 'gcc:12-alpine',
    javascript: 'node:20-alpine',
  };

  constructor() {
    this.docker = new Docker();
    this.logger.log('Docker service initialized');
  }

  async runCode(code: string, language: string): Promise<RunResult> {
    try {
      const image = this.languageImages[language];
      if (!image) {
        throw new Error(`Unsupported language: ${language}`);
      }

      // Ensure image is pulled
      await this.ensureImage(image);

      // Create execution script based on language
      const script = this.createExecutionScript(code, language);

      // Run in Docker container
      const result = await this.runInContainer(image, script, language);

      return result;
    } catch (error) {
      this.logger.error(`Docker execution failed: ${error.message}`);
      throw error;
    }
  }

  private async ensureImage(image: string): Promise<void> {
    try {
      await this.docker.getImage(image).inspect();
      this.logger.log(`Image ${image} is available`);
    } catch {
      this.logger.log(`Pulling image: ${image}`);
      await new Promise((resolve, reject) => {
        this.docker.pull(image, (err, stream) => {
          if (err) return reject(err);
          this.docker.modem.followProgress(stream, (err, res) =>
            err ? reject(err) : resolve(res),
          );
        });
      });
    }
  }

  private createExecutionScript(code: string, language: string): string {
    switch (language) {
      case 'python':
        return code;

      case 'javascript':
        return code;

      case 'java':
        // Extract class name or use default
        const classMatch = code.match(/public\s+class\s+(\w+)/);
        const className = classMatch ? classMatch[1] : 'Main';
        return `
echo '${this.escapeCode(code)}' > ${className}.java
javac ${className}.java
java ${className}
        `.trim();

      case 'cpp':
        return `
echo '${this.escapeCode(code)}' > main.cpp
g++ -o main main.cpp
./main
        `.trim();

      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private async runInContainer(
    image: string,
    script: string,
    language: string,
  ): Promise<RunResult> {
    const containerId = `exec-${uuidv4()}`;

    const container = await this.docker.createContainer({
      Image: image,
      name: containerId,
      Cmd:
        language === 'python'
          ? ['python', '-c', script]
          : language === 'javascript'
            ? ['node', '-e', script]
            : ['/bin/sh', '-c', script],

      // Security constraints
      HostConfig: {
        AutoRemove: true,
        Memory: 128 * 1024 * 1024, // 128MB
        MemorySwap: 128 * 1024 * 1024,
        NanoCpus: 500000000, // 0.5 CPU
        PidsLimit: 50,
        NetworkMode: 'none', // No network access
        ReadonlyRootfs: false, // Need writable for compilation
        SecurityOpt: ['no-new-privileges'],
        CapDrop: ['ALL'],
      },

      // Working directory with tmpfs
      WorkingDir: '/tmp',
    });

    try {
      await container.start();

      // Wait for container with timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Execution timeout (5s)')), 5000);
      });

      const execPromise = container.wait();
      await Promise.race([execPromise, timeoutPromise]);

      // Get logs
      const logs = await container.logs({
        stdout: true,
        stderr: true,
      });

      const output = logs.toString('utf8');
      const { stdout, stderr } = this.parseLogs(output);

      return {
        stdout: stdout.slice(0, 1000000), // Max 1MB output
        stderr: stderr.slice(0, 1000000),
      };
    } catch (error) {
      // Kill container if still running
      try {
        await container.kill();
        await container.remove();
      } catch {}

      throw error;
    }
  }

  private escapeCode(code: string): string {
    return code
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "'\\''")
      .replace(/\n/g, '\\n');
  }

  private parseLogs(logs: string): { stdout: string; stderr: string } {
    // Simple log parsing - in production you might need more sophisticated parsing
    const lines = logs.split('\n');
    const stdout: string[] = [];
    const stderr: string[] = [];

    lines.forEach((line) => {
      // Docker adds 8-byte headers to distinguish stdout/stderr
      if (line.length > 8) {
        const header = line.charCodeAt(0);
        const content = line.slice(8);

        if (header === 2) {
          // stderr
          stderr.push(content);
        } else {
          // stdout
          stdout.push(content);
        }
      }
    });

    return {
      stdout: stdout.join('\n'),
      stderr: stderr.join('\n'),
    };
  }
}
