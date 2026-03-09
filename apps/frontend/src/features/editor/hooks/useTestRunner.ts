"use client";

import { useState, useCallback } from "react";
import type { WorkerOutput } from "../workers/javascript.worker";

export interface TestCase {
    input: string;
    expectedOutput: string;
    hidden: boolean;
}

export interface TestCaseResult {
    index: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    hidden: boolean;
    error?: string;
    executionTime?: number;
}

/** Run a single test case — worker URL MUST be created inline for webpack bundling */
function runJSTest(code: string, stdin: string, timeoutMs: number): Promise<{ output: string; error?: string; executionTime?: number }> {
    return new Promise((resolve) => {
        const worker = new Worker(
            new URL("../workers/javascript.worker.ts", import.meta.url),
            { type: "module" }
        );

        const timer = setTimeout(() => {
            worker.terminate();
            resolve({ output: "", error: "⏱ Time Limit Exceeded" });
        }, timeoutMs);

        worker.onmessage = (e: MessageEvent<WorkerOutput>) => {
            clearTimeout(timer);
            worker.terminate();
            resolve({
                output: e.data.output === "(No output)" ? "" : e.data.output,
                error: e.data.error || undefined,
                executionTime: e.data.executionTime,
            });
        };

        worker.onerror = (e) => {
            clearTimeout(timer);
            worker.terminate();
            resolve({ output: "", error: e.message });
        };

        worker.postMessage({ code, stdin });
    });
}

function runPyTest(code: string, stdin: string, timeoutMs: number): Promise<{ output: string; error?: string; executionTime?: number }> {
    return new Promise((resolve) => {
        const worker = new Worker(
            new URL("../workers/python.worker.ts", import.meta.url),
            { type: "module" }
        );

        const timer = setTimeout(() => {
            worker.terminate();
            resolve({ output: "", error: "⏱ Time Limit Exceeded" });
        }, timeoutMs);

        worker.onmessage = (e: MessageEvent<WorkerOutput>) => {
            clearTimeout(timer);
            worker.terminate();
            resolve({
                output: e.data.output === "(No output)" ? "" : e.data.output,
                error: e.data.error || undefined,
                executionTime: e.data.executionTime,
            });
        };

        worker.onerror = (e) => {
            clearTimeout(timer);
            worker.terminate();
            resolve({ output: "", error: e.message });
        };

        worker.postMessage({ code, stdin });
    });
}

export function useTestRunner() {
    const [results, setResults] = useState<TestCaseResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [allPassed, setAllPassed] = useState(false);

    const runTests = useCallback(async (code: string, language: string, testCases: TestCase[]) => {
        if (!code.trim() || testCases.length === 0) return;

        setIsRunning(true);
        setAllPassed(false);
        setResults([]);

        const isPython = language === "python";
        const timeoutMs = isPython ? 15000 : 5000;
        const newResults: TestCaseResult[] = [];

        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];

            const runFn = isPython ? runPyTest : runJSTest;
            const { output, error, executionTime } = await runFn(code, tc.input, timeoutMs);

            const actual = output.trim();
            const expected = tc.expectedOutput.trim();
            const passed = actual === expected;

            newResults.push({
                index: i,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: actual,
                passed,
                hidden: tc.hidden,
                error,
                executionTime,
            });

            setResults([...newResults]);
        }

        const all = newResults.every(r => r.passed);
        setAllPassed(all);
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setResults([]);
        setAllPassed(false);
    }, []);

    return { results, isRunning, allPassed, runTests, reset };
}
