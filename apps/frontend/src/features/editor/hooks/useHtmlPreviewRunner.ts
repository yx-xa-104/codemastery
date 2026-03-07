import { useState, useCallback } from 'react';
import type { RunResult } from './useCodeRunner';

export function useHtmlPreviewRunner() {
    const [result, setResult] = useState<RunResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = useCallback(async (code: string, language: string) => {
        if (!code.trim()) return;

        setIsRunning(true);
        setResult(null);

        // Create an artificial slight delay to show loading state (good UX)
        await new Promise(resolve => setTimeout(resolve, 300));

        let formattedHtml = code;

        if (language === 'css') {
            formattedHtml = `
<!DOCTYPE html>
<html>
<head>
<style>
${code}
</style>
</head>
<body>
    <div class="preview-container">
        <h2>CSS Preview applied successfully</h2>
        <p>If you're styling tags like body or h1, you will see the effects immediately!</p>
        <button class="btn">Example Button</button>
    </div>
</body>
</html>`;
        }

        setResult({
            output: "HTML/CSS rendered successfully to Output panel.",
            htmlPreview: formattedHtml,
            executionTime: 0,
        });

        setIsRunning(false);
    }, []);

    return { result, isRunning, handleRun, setResult };
}
