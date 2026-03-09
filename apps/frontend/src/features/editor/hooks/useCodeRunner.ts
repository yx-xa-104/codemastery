"use client";

import { useState, useCallback } from "react";
import { usePythonRunner } from "./usePythonRunner";
import { useJavaScriptRunner } from "./useJavaScriptRunner";
import { useSqlRunner } from "./useSqlRunner";
import { useHtmlPreviewRunner } from "./useHtmlPreviewRunner";
import { useServerRunner } from "./useServerRunner";

export interface RunResult {
    output: string;
    error?: string;
    executionTime?: number;
    htmlPreview?: string;
}

export function useCodeRunner(initialCode: string = "// Code here...") {
    const [code, setCode] = useState(initialCode);
    const [stdinValue, setStdinValue] = useState("");
    const [activeRunnerResult, setActiveRunnerResult] = useState<RunResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    // Initialize all strategy hooks
    const pythonRunner = usePythonRunner();
    const jsRunner = useJavaScriptRunner();
    const sqlRunner = useSqlRunner();
    const htmlRunner = useHtmlPreviewRunner();
    const serverRunner = useServerRunner();

    const handleRun = useCallback(async (language: string = "javascript", stdinOverride?: string) => {
        const stdin = stdinOverride ?? stdinValue;
        if (!code.trim()) return;
        setIsRunning(true);
        setActiveRunnerResult(null);

        try {
            switch (language) {
                case 'python':
                    await pythonRunner.handleRun(code, stdin);
                    break;
                case 'javascript':
                case 'typescript':
                    await jsRunner.handleRun(code, stdin);
                    break;
                case 'sql':
                case 'sqlite':
                    await sqlRunner.handleRun(code);
                    break;
                case 'html':
                case 'css':
                    await htmlRunner.handleRun(code, language);
                    break;
                case 'typescript':
                case 'java':
                case 'cpp':
                case 'csharp':
                case 'php':
                case 'pascal':
                case 'postgresql':
                case 'mysql':
                case 'sqlserver':
                    await serverRunner.handleRun(code, language);
                    break;
                default:
                    setActiveRunnerResult({
                        output: "",
                        error: `Unsupported language: ${language}`,
                        executionTime: 0,
                    });
            }
        } finally {
            setIsRunning(false);
        }
    }, [code, stdinValue, pythonRunner, jsRunner, sqlRunner, htmlRunner, serverRunner]);

    // Use an effect to sync the result from the active runner to the main router state
    // We could do this implicitly but since the hooks have their own states, we need to map them back.
    // Instead of effects, let's just derive it below based on the last run language,
    // or better, since we don't know easily which one finished last without tracking,
    // we update activeRunnerResult inside the `switch` block.
    // Ah, wait: those sub-hooks have asynchronous `handleRun` but they update their OWN `result` state,
    // which won't automatically sync to `activeRunnerResult` if we just `await`.
    // Actually, `handleRun` in sub-hooks returns an updated value in their state, but not as a return value.
    // Let's refactor the sub-hooks return or just sync it.
    // The easiest way is to read the results from the hooks, but since they fire async,
    // let's create a single wrapper that manages the single `result` object.
    // Actually, we can fix this by checking the combined results, but since we await handleRun:

    // An alternative cleaner pattern: let the sub-hooks return the RunResult directly.
    // For now, let's use useEffect to sync the latest truthy result.
    // But since only one runs at a time, we can just aggregate them.
    const result: RunResult | null =
        pythonRunner.result ||
        jsRunner.result ||
        sqlRunner.result ||
        htmlRunner.result ||
        serverRunner.result ||
        activeRunnerResult;

    const handleReset = useCallback(() => {
        setCode(initialCode);
        setActiveRunnerResult(null);
        pythonRunner.setResult(null);
        jsRunner.setResult(null);
        sqlRunner.setResult(null);
        htmlRunner.setResult(null);
        serverRunner.setResult(null);
    }, [initialCode, pythonRunner, jsRunner, sqlRunner, htmlRunner, serverRunner]);

    // Legacy output string mapping
    const output = result
        ? result.error
            ? `Error: ${result.error}`
            : result.output || "Program finished successfully without output."
        : null;

    return {
        code,
        setCode,
        stdinValue,
        setStdinValue,
        output,
        result,
        isRunning: isRunning || pythonRunner.isRunning || jsRunner.isRunning || sqlRunner.isRunning || htmlRunner.isRunning || serverRunner.isRunning,
        handleRun,
        handleReset
    };
}
