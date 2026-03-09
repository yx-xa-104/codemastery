import { useState, useCallback, useRef, useEffect } from 'react';
import type { RunResult } from './useCodeRunner';
import type { WorkerInput, WorkerOutput } from '../workers/javascript.worker';

export function useJavaScriptRunner() {
    const [result, setResult] = useState<RunResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const workerRef = useRef<Worker | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const initWorker = useCallback(() => {
        if (typeof window === 'undefined') return;

        if (workerRef.current) {
            workerRef.current.terminate();
        }

        workerRef.current = new Worker(
            new URL('../workers/javascript.worker.ts', import.meta.url),
            { type: 'module' }
        );
    }, []);

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

            // 5 second timeout for JS
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                worker.terminate();
                initWorker();
                setIsRunning(false);
                setResult({
                    output: "",
                    error: "⏱ Time Limit Exceeded (5s)",
                    executionTime: 5000,
                });
                resolve();
            }, 5000);

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

            worker.postMessage({ code, stdin: stdin || "" } as WorkerInput);
        });
    }, [initWorker]);

    return { result, isRunning, handleRun, setResult };
}
