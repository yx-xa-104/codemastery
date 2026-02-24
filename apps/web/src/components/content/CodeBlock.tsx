'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Play } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

export default function CodeBlock({ children, className, inline }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inline code — navy/indigo pill style
  if (inline) {
    return (
      <code className="bg-navy-800 text-indigo-300 border border-navy-700 px-2 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  }

  // Block code — matches interactive_lesson.html concept
  return (
    <div className="relative group my-6 bg-navy-800 rounded-xl shadow-2xl border border-navy-700 overflow-hidden">
      {/* Titlebar */}
      <div className="bg-navy-950 px-4 py-2.5 border-b border-navy-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* macOS traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-xs font-mono text-slate-500 ml-1">
            {language === 'python' ? 'main.py' : language === 'javascript' ? 'main.js' : `main.${language}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs px-3 py-1.5 rounded transition-all"
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5" /> Đã sao chép!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Sao chép</>
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: 'rgba(17, 34, 64, 0.5)', // navy-800/50
          fontSize: '0.875rem',
          lineHeight: '1.75',
          padding: '1.5rem',
        }}
        lineNumberStyle={{
          color: '#5c6773',
          paddingRight: '1rem',
          borderRight: '1px solid #233554',
          marginRight: '1rem',
          userSelect: 'none',
        }}
      >
        {children}
      </SyntaxHighlighter>

      {/* AI explain hover hint */}
      <div className="absolute top-12 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-900/80 text-indigo-200 border border-indigo-500/30 backdrop-blur gap-1">
          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
          Bôi đen để giải thích bằng AI
        </span>
      </div>
    </div>
  );
}
