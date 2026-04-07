import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionService } from './execution.service';

describe('ExecutionService', () => {
  let service: ExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExecutionService],
    }).compile();

    service = module.get<ExecutionService>(ExecutionService);
    
    // mock global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should mock a successful code execution', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        run: { output: 'Hello World\n', stderr: '' },
      }),
    });

    const result = await service.executeCode('print("Hello World")', 'python');
    expect(result.output).toBe('Hello World\n');
    expect(result.error).toBeUndefined();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const fetchArgs = (global.fetch as jest.Mock).mock.calls[0];
    expect(fetchArgs[0]).toBe('https://emkc.org/api/v2/piston/execute');
  });
  
  it('should return error for unsupported language', async () => {
    const result = await service.executeCode('print()', 'unknownlang');
    expect(result.error).toContain('not supported by the remote execution engine');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should format compilation errors correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        compile: { code: 1, stderr: 'SyntaxError: missing )' },
        run: { output: '', stderr: '' },
      }),
    });

    const result = await service.executeCode('console.log(', 'javascript');
    expect(result.error).toContain('Compilation Error:');
    expect(result.error).toContain('SyntaxError: missing )');
  });

  it('should validate code length', async () => {
    const longCode = 'a'.repeat(20001);
    const result = await service.executeCode(longCode, 'javascript');
    expect(result.error).toContain('Code is too long or empty (max 20KB)');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should catch API fetch failures', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
      json: async () => ({ message: 'API failure' }),
    });

    const result = await service.executeCode('console.log("hello")', 'javascript');
    expect(result.error).toContain('Piston API Error: API failure');
  });
});
