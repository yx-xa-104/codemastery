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
  height = '300px',
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

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
    window.dispatchEvent(new CustomEvent('ai-explain-code', { detail: { code, language } }));
  };

  const getMonacoLanguage = () => {
    const map: Record<string, string> = {
      python: 'python', javascript: 'javascript', java: 'java', cpp: 'cpp', html: 'html',
    };
    return map[language] || 'plaintext';
  };

  return (
    <div className="border border-navy-700 rounded-xl overflow-hidden bg-navy-800 shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-navy-950 border-b border-navy-700">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-accent-gold uppercase tracking-wide">
            {language}
          </span>
          {executionTime !== null && (
            <span className="text-xs text-slate-400">⏱ {executionTime}ms</span>
          )}
        </div>

        {!readonly && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAiExplain}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 rounded-lg transition-all"
              title="AI Explain"
            >
              <Sparkles className="w-4 h-4" />
              Explain
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-300 bg-navy-700 hover:bg-navy-600 border border-navy-600 rounded-lg transition-all"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold text-navy-950 bg-accent-gold hover:bg-accent-gold-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-amber-900/20 transition-all transform hover:scale-105"
            >
              {isRunning ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Đang chạy...</>
              ) : (
                <><Play className="w-4 h-4" /> Chạy thử</>
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
          tabSize: 4,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          fontFamily: 'Source Code Pro, Fira Code, monospace',
        }}
      />

      {/* Output Panel */}
      {(output || error) && (
        <div className="border-t border-navy-700">
          <div className="px-4 py-2 bg-navy-950 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`} />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {error ? 'Lỗi' : 'Kết quả'}
            </p>
          </div>
          <div className="px-4 py-3 bg-navy-950 font-mono text-sm max-h-40 overflow-y-auto">
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
