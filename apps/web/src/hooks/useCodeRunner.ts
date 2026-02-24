"use client";

import { useState, useCallback } from "react";

export function useCodeRunner(initialCode: string = "// Code here...") {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = useCallback(() => {
        setIsRunning(true);
        setTimeout(() => {
            try {
                const logs: string[] = [];
                const originalLog = console.log;
                console.log = (...args) => {
                    logs.push(
                        args
                            .map((a) => (typeof a === "object" ? JSON.stringify(a) : a))
                            .join(" ")
                    );
                };

                // eslint-disable-next-line no-new-func
                const fn = new Function(code);
                fn();

                console.log = originalLog;
                setOutput(
                    logs.join("\n") || "Program finished successfully without output."
                );
            } catch (err: any) {
                setOutput(`Error: ${err.message}`);
            }
            setIsRunning(false);
        }, 800);
    }, [code]);

    const handleReset = useCallback(() => {
        setCode(initialCode);
        setOutput(null);
    }, [initialCode]);

    return { code, setCode, output, isRunning, handleRun, handleReset };
}
