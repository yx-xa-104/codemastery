/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="webworker" />

// ============================================================
// Python Worker - Runs Python code via Pyodide (WebAssembly)
// Supports stdin via sys.stdin override
// ============================================================

export interface WorkerInput {
    code: string;
    stdin?: string;
}

export interface WorkerOutput {
    success: boolean;
    output: string;
    error?: string;
    executionTime: number;
}

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";

let pyodideInstance: any = null;
let pyodideLoading: Promise<any> | null = null;

async function getPyodide(): Promise<any> {
    if (pyodideInstance) return pyodideInstance;

    if (!pyodideLoading) {
        pyodideLoading = (async () => {
            importScripts(PYODIDE_CDN);
            const pyodide = await (self as any).loadPyodide();
            pyodideInstance = pyodide;
            return pyodide;
        })();
    }

    return pyodideLoading;
}

self.onmessage = async function (event: MessageEvent<WorkerInput>) {
    const { code, stdin } = event.data;
    const startTime = performance.now();

    try {
        const pyodide = await getPyodide();

        // Redirect stdout, stderr, and optionally stdin
        const stdinSetup = stdin
            ? `sys.stdin = io.StringIO(${JSON.stringify(stdin)})`
            : `sys.stdin = io.StringIO("")`;

        pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
${stdinSetup}
`);

        pyodide.runPython(code);

        const stdout: string = pyodide.runPython("sys.stdout.getvalue()");
        const stderr: string = pyodide.runPython("sys.stderr.getvalue()");

        const response: WorkerOutput = {
            success: true,
            output: stdout || "(No output)",
            error: stderr || undefined,
            executionTime: Math.round(performance.now() - startTime),
        };

        self.postMessage(response);
    } catch (err: any) {
        const response: WorkerOutput = {
            success: false,
            output: "",
            error: err.message || String(err),
            executionTime: Math.round(performance.now() - startTime),
        };

        self.postMessage(response);
    }
};
