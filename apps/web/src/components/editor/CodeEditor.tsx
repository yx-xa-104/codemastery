'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Sparkles, Loader2 } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  language: 'python' | 'javascript' | 'java' | 'cpp' | 'html';
  readonly?: boolean;
  height?: string;
  onCodeChange?: (code: string) => void;
}

export default function CodeEditor({
  initialCode = '',
  language,
  readonly = false,
  height = '400px',
  onCodeChange,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');
    setExecutionTime(null);

    try {
      const startTime = Date.now();
      
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const endTime = Date.now();
      setExecutionTime(endTime - startTime);

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        setOutput(result.output || result.stdout || 'Code executed successfully');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setError(null);
    setExecutionTime(null);
  };

  const handleAiExplain = () => {
    // Dispatch custom event for AI explanation
    window.dispatchEvent(
      new CustomEvent('ai-explain-code', {
        detail: { code, language },
      })
    );
  };

  // Get Monaco language identifier
  const getMonacoLanguage = () => {
    const languageMap: Record<string, string> = {
      python: 'python',
      javascript: 'javascript',
      java: 'java',
      cpp: 'cpp',
      html: 'html',
    };
    return languageMap[language] || 'plaintext';
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {language}
          </span>
          {executionTime !== null && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ⏱ {executionTime}ms
            </span>
          )}
        </div>

        {!readonly && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAiExplain}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30 rounded-md transition-colors"
              title="AI Explain Code"
            >
              <Sparkles className="w-4 h-4" />
              Explain
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md transition-colors"
              title="Reset Code"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Monaco Editor */}
      <Editor
        height={height}
        language={getMonacoLanguage()}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          readOnly: readonly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
        }}
      />

      {/* Output Panel */}
      {(output || error) && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 bg-gray-800">
            <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
              Output
            </p>
          </div>
          <div className="px-4 py-3 bg-gray-900 font-mono text-sm max-h-64 overflow-y-auto">
            {error ? (
              <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
            ) : (
              <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
