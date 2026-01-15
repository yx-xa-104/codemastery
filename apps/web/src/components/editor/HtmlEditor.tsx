'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Code2 } from 'lucide-react';

interface HtmlEditorProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  height?: string;
}

export default function HtmlEditor({
  initialHtml = '<h1>Hello World!</h1>',
  initialCss = 'h1 { color: #6366f1; font-family: sans-serif; }',
  initialJs = '// JavaScript code here\nconsole.log("Hello!");',
  height = '300px',
}: HtmlEditorProps) {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [autoRun, setAutoRun] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runCode = () => {
    if (!iframeRef.current) return;

    const document = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { margin: 16px; font-family: system-ui, -apple-system, sans-serif; }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            // Capture console.log
            (function() {
              const oldLog = console.log;
              console.log = function(...args) {
                oldLog.apply(console, args);
                window.parent.postMessage({ type: 'console', data: args }, '*');
              };
            })();

            try {
              ${js}
            } catch (error) {
              console.error('Error:', error.message);
            }
          </script>
        </body>
      </html>
    `;

    iframeRef.current.srcdoc = document;
  };

  const handleReset = () => {
    setHtml(initialHtml);
    setCss(initialCss);
    setJs(initialJs);
  };

  // Auto-run on code change
  useEffect(() => {
    if (autoRun) {
      const timeout = setTimeout(() => runCode(), 500);
      return () => clearTimeout(timeout);
    }
  }, [html, css, js, autoRun]);

  // Listen for console messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        console.log('[Preview]:', ...event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const tabs = [
    { id: 'html' as const, label: 'HTML', language: 'html', value: html, onChange: setHtml },
    { id: 'css' as const, label: 'CSS', language: 'css', value: css, onChange: setCss },
    { id: 'js' as const, label: 'JavaScript', language: 'javascript', value: js, onChange: setJs },
  ];

  const currentTab = tabs.find(t => t.id === activeTab)!;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      {/* Tab Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(e) => setAutoRun(e.target.checked)}
              className="rounded"
            />
            Auto-run
          </label>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {!autoRun && (
            <button
              onClick={runCode}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              <Play className="w-4 h-4" />
              Run
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <Editor
        height={height}
        language={currentTab.language}
        value={currentTab.value}
        onChange={(value) => currentTab.onChange(value || '')}
        theme="vs-dark"
        options={{
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

      {/* Preview Panel */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="px-4 py-2 bg-gray-800 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-gray-300" />
          <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
            Live Preview
          </p>
        </div>
        <div className="bg-white" style={{ height }}>
          <iframe
            ref={iframeRef}
            sandbox="allow-scripts"
            className="w-full h-full border-0"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
