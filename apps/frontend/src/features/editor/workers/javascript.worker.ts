/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="webworker" />

// ============================================================
// JavaScript Worker - Sandboxed JS execution via Function()
// Override console.log to capture output
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

self.onmessage = function (event: MessageEvent<WorkerInput>) {
    const { code } = event.data;
    const startTime = performance.now();
    const logs: string[] = [];

    try {
        // Create a sandboxed console that captures output
        const sandboxConsole = {
            log: (...args: any[]) => logs.push(args.map(formatArg).join(" ")),
            error: (...args: any[]) => logs.push("[ERROR] " + args.map(formatArg).join(" ")),
            warn: (...args: any[]) => logs.push("[WARN] " + args.map(formatArg).join(" ")),
            info: (...args: any[]) => logs.push(args.map(formatArg).join(" ")),
            table: (data: any) => logs.push(JSON.stringify(data, null, 2)),
        };

        // Execute code with sandboxed console using Function() constructor
        // By passing 'console' as an argument, we override the global console for this execution
        const fn = new Function("console", code);
        const result = fn(sandboxConsole);

        // If function returns a value and nothing was logged, show the return value
        if (result !== undefined && logs.length === 0) {
            logs.push(formatArg(result));
        }

        const response: WorkerOutput = {
            success: true,
            output: logs.length > 0 ? logs.join("\n") : "(No output)",
            executionTime: Math.round(performance.now() - startTime),
        };

        self.postMessage(response);
    } catch (err: any) {
        const response: WorkerOutput = {
            success: false,
            output: logs.join("\n"),
            error: err.message || String(err),
            executionTime: Math.round(performance.now() - startTime),
        };

        self.postMessage(response);
    }
};

/** Format any JS value to a readable string */
function formatArg(arg: any): string {
    if (arg === null) return "null";
    if (arg === undefined) return "undefined";
    if (typeof arg === "object") {
        try {
            return JSON.stringify(arg, null, 2);
        } catch {
            return String(arg); // Fallback for circular references or big objects
        }
    }
    return String(arg);
}
