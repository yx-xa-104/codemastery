"use client";

import { useState, useCallback } from "react";

export interface RunResult {
    output: string;
    error?: string;
    executionTime?: number;
}

export function useCodeRunner(initialCode: string = "// Code here...") {
    const [code, setCode] = useState(initialCode);
    const [result, setResult] = useState<RunResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = useCallback(async (language: string = "javascript") => {
        if (!code.trim()) return;
        setIsRunning(true);
        setResult(null);

        try {
            const response = await fetch("/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language }),
            });

            const data = await response.json();

            if (!response.ok) {
                setResult({ output: "", error: data.error ?? "Execution failed" });
            } else {
                setResult({
                    output: data.output ?? "",
                    error: data.error,
                    executionTime: data.executionTime,
                });
            }
        } catch (err: any) {
            setResult({ output: "", error: err.message ?? "Network error" });
        } finally {
            setIsRunning(false);
        }
    }, [code]);

    const handleReset = useCallback(() => {
        setCode(initialCode);
        setResult(null);
    }, [initialCode]);

    // Legacy: expose `output` string for backward compat with CodeEditor
    const output = result
        ? result.error
            ? `Error: ${result.error}`
            : result.output || "Program finished successfully without output."
        : null;

    return { code, setCode, output, result, isRunning, handleRun, handleReset };
}
