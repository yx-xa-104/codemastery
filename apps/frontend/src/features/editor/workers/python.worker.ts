/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="webworker" />

// ============================================================
// Python Worker - Runs Python code via Pyodide (WebAssembly)
// Cache Pyodide instance across invocations for performance
// ============================================================

export interface WorkerInput {
    code: string;
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

/**
 * Load Pyodide only once, return cached instance for subsequent calls.
 * This prevents re-downloading the ~10MB WASM bundle on every run.
 */
async function getPyodide(): Promise<any> {
    if (pyodideInstance) return pyodideInstance;

    if (!pyodideLoading) {
        pyodideLoading = (async () => {
            // Import Pyodide CDN script into worker scope
            importScripts(PYODIDE_CDN);
            const pyodide = await (self as any).loadPyodide();
            pyodideInstance = pyodide;
            return pyodide;
        })();
    }

    return pyodideLoading;
}

self.onmessage = async function (event: MessageEvent<WorkerInput>) {
    const { code } = event.data;
    const startTime = performance.now();

    try {
        const pyodide = await getPyodide();

        // Redirect stdout and stderr to capture output
        pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

        // Execute user code
        pyodide.runPython(code);

        // Collect captured output
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
