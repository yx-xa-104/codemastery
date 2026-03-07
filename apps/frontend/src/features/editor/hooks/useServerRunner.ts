/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import type { RunResult } from './useCodeRunner';
import { apiClient } from '@/shared/lib/api-client';

export function useServerRunner() {
    const [result, setResult] = useState<RunResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = useCallback(async (code: string, language: string) => {
        if (!code.trim()) return;

        setIsRunning(true);
        setResult(null);

        try {
            // Forward the request to our NestJS proxy server
            // Note: Since NestJS is using global prefix 'api', the URL is /execute.
            // Wait, previous file had '/api/execute'. Since apiClient prepends base URL and we are using absolute/relative paths based on ENV.

            // Using standard Fetch API to match existing BFF proxy patterns or standard API call
            // We use apiClient here since it auto-handles auth/cookies if configured
            const response = await apiClient.post('/execute', { code, language }) as { data: any };
            const responseData = response.data;

            setResult({
                output: responseData.output || "(No output)",
                error: responseData.error,
                executionTime: responseData.executionTime,
            });

        } catch (err: any) {
            // Check if Axios error with response data
            const errorMsg = err.response?.data?.message || err.message || "Network Error or Server Timeout";

            setResult({
                output: "",
                error: `Server Execution Failed: \n${errorMsg}`
            });
        } finally {
            setIsRunning(false);
        }
    }, []);

    return { result, isRunning, handleRun, setResult };
}
