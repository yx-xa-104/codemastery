import { useState, useCallback, useRef, useEffect } from 'react';
import type { RunResult } from './useCodeRunner';
import type { WorkerInput, WorkerOutput } from '../workers/python.worker';

export function usePythonRunner() {
    const [result, setResult] = useState<RunResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const workerRef = useRef<Worker | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize or re-create worker
    const initWorker = useCallback(() => {
        if (typeof window === 'undefined') return;

        if (workerRef.current) {
            workerRef.current.terminate();
        }

        workerRef.current = new Worker(
            new URL('../workers/python.worker.ts', import.meta.url),
            { type: 'module' }
        );
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        initWorker();
        return () => {
            if (workerRef.current) workerRef.current.terminate();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [initWorker]);

    const handleRun = useCallback(async (code: string, stdin?: string) => {
        if (!code.trim() || !workerRef.current) return;

        setIsRunning(true);
        setResult(null);

        return new Promise<void>((resolve) => {
            const worker = workerRef.current!;

            // Set 10-second timeout for Pyodide (cold start is slow)
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                worker.terminate();
                initWorker(); // Restart worker for next run
                setIsRunning(false);
                setResult({
                    output: "",
                    error: "⏱ Time Limit Exceeded (10s)",
                    executionTime: 10000,
                });
                resolve();
            }, 10000);

            worker.onmessage = (e: MessageEvent<WorkerOutput>) => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setIsRunning(false);
                setResult({
                    output: e.data.output,
                    error: e.data.error,
                    executionTime: e.data.executionTime,
                });
                resolve();
            };

            worker.onerror = (e) => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setIsRunning(false);
                setResult({
                    output: "",
                    error: `Worker Error: ${e.message}`,
                });
                resolve();
            };

            const input: WorkerInput = { code, stdin: stdin || "" };
            worker.postMessage(input);
        });
    }, [initWorker]);

    return { result, isRunning, handleRun, setResult };
}
