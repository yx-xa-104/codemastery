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

  private readonly languageImages: Record<string, string> = {
    python: 'python:3.11-alpine',
    java: 'eclipse-temurin:17-jdk-alpine',
    cpp: 'gcc:12-alpine',
    javascript: 'node:20-alpine',
  };

  constructor() {
    const isWindows = process.platform === 'win32';
    this.docker = isWindows
      ? new Docker({ host: '127.0.0.1', port: 2375 })
      : new Docker();
    this.logger.log(
      `Docker service initialized on ${process.platform} via ${isWindows ? 'TCP:2375' : 'unix socket'}`,
    );
  }

  async runCode(code: string, language: string): Promise<RunResult> {
    const image = this.languageImages[language];
    if (!image) throw new Error(`Unsupported language: ${language}`);

    await this.ensureImage(image);
    const script = this.createExecutionScript(code, language);
    return this.runInContainer(image, script, language);
  }

  private async ensureImage(image: string): Promise<void> {
    try {
      await this.docker.getImage(image).inspect();
    } catch {
      this.logger.log(`Pulling image: ${image}`);
      await new Promise<void>((resolve, reject) => {
        this.docker.pull(image, (err: Error | null, stream: NodeJS.ReadableStream) => {
          if (err) return reject(err);
          this.docker.modem.followProgress(stream, (err: Error | null) =>
            err ? reject(err) : resolve(),
          );
        });
      });
    }
  }

  private createExecutionScript(code: string, language: string): string {
    switch (language) {
      case 'python':
      case 'javascript':
        return code;

      case 'java': {
        const classMatch = code.match(/public\s+class\s+(\w+)/);
        const className = classMatch ? classMatch[1] : 'Main';
        const escaped = this.escapeCode(code);
        return `printf '%s' '${escaped}' > ${className}.java && javac ${className}.java && java ${className}`;
      }

      case 'cpp': {
        const escaped = this.escapeCode(code);
        return `printf '%s' '${escaped}' > main.cpp && g++ -O2 -o main main.cpp && ./main`;
      }

      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private async runInContainer(
    image: string,
    script: string,
    language: string,
  ): Promise<RunResult> {
    const containerName = `exec-${uuidv4()}`;

    const cmd =
      language === 'python'
        ? ['python3', '-c', script]
        : language === 'javascript'
          ? ['node', '-e', script]
          : ['/bin/sh', '-c', script];

    const container = await this.docker.createContainer({
      Image: image,
      name: containerName,
      Cmd: cmd,
      AttachStdout: true,
      AttachStderr: true,
      HostConfig: {
        AutoRemove: true,
        Memory: 128 * 1024 * 1024,
        MemorySwap: 128 * 1024 * 1024,
        NanoCpus: 500_000_000,
        PidsLimit: 50,
        NetworkMode: 'none',
        SecurityOpt: ['no-new-privileges'],
        CapDrop: ['ALL'],
      },
      WorkingDir: '/tmp',
    });

    try {
      await container.start();

      await Promise.race([
        container.wait(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Execution timeout (5s)')), 5000),
        ),
      ]);

      const logBuffer: Buffer = await container.logs({
        stdout: true,
        stderr: true,
        follow: false,
      }) as unknown as Buffer;

      return this.demuxBuffer(
        Buffer.isBuffer(logBuffer) ? logBuffer : Buffer.from(logBuffer as unknown as string),
      );
    } catch (error: any) {
      try { await container.kill(); } catch { /* already removed */ }
      throw error;
    }
  }

  /**
   * Demultiplex Docker's multiplexed log stream.
   * Frame: [stream_type(1B)][reserved(3B)][size(4B BE)][payload]
   * stream_type: 1 = stdout, 2 = stderr
   */
  private demuxBuffer(buf: Buffer): RunResult {
    const stdout: string[] = [];
    const stderr: string[] = [];
    let offset = 0;

    while (offset + 8 <= buf.length) {
      const streamType = buf.readUInt8(offset);
      const size = buf.readUInt32BE(offset + 4);
      offset += 8;
      if (offset + size > buf.length) break;
      const payload = buf.slice(offset, offset + size).toString('utf8');
      offset += size;
      if (streamType === 2) stderr.push(payload);
      else stdout.push(payload);
    }

    return {
      stdout: stdout.join('').slice(0, 100_000),
      stderr: stderr.join('').slice(0, 100_000),
    };
  }

  private escapeCode(code: string): string {
    return code.replace(/\\/g, '\\\\').replace(/'/g, "'\\''");
  }
}
