/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="webworker" />

// ============================================================
// JavaScript Worker - Sandboxed JS execution via Function()
// Supports stdin via prompt() override
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

self.onmessage = function (event: MessageEvent<WorkerInput>) {
    const { code, stdin } = event.data;
    const startTime = performance.now();
    const logs: string[] = [];

    try {
        const sandboxConsole = {
            log: (...args: any[]) => logs.push(args.map(formatArg).join(" ")),
            error: (...args: any[]) => logs.push("[ERROR] " + args.map(formatArg).join(" ")),
            warn: (...args: any[]) => logs.push("[WARN] " + args.map(formatArg).join(" ")),
            info: (...args: any[]) => logs.push(args.map(formatArg).join(" ")),
            table: (data: any) => logs.push(JSON.stringify(data, null, 2)),
        };

        // Build stdin queue from input lines for prompt() override
        const stdinLines = stdin ? stdin.split("\n").filter(l => l !== "") : [];
        let stdinIndex = 0;
        const sandboxPrompt = () => {
            if (stdinIndex < stdinLines.length) {
                return stdinLines[stdinIndex++];
            }
            return "";
        };

        // Execute code with sandboxed console and prompt
        const fn = new Function("console", "prompt", code);
        const result = fn(sandboxConsole, sandboxPrompt);

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

function formatArg(arg: any): string {
    if (arg === null) return "null";
    if (arg === undefined) return "undefined";
    if (typeof arg === "object") {
        try {
            return JSON.stringify(arg, null, 2);
        } catch {
            return String(arg);
        }
    }
    return String(arg);
}
