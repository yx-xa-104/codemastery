"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, AlertTriangle, CheckCircle, Code2 } from "lucide-react";
import { useCodeRunner } from "@/hooks/useCodeRunner";

interface CodeEditorProps {
    initialCode?: string;
    language?: string;
    onRun?: (code: string) => void;
}

export function CodeEditor({
    initialCode = "// Code here...",
    language = "javascript",
    onRun,
}: CodeEditorProps) {
    const { code, setCode, output, isRunning, handleRun, handleReset } = useCodeRunner(initialCode);

    const handleRunWithCallback = () => {
        handleRun();
        if (onRun) onRun(code);
    };

    return (
        <div className="flex flex-col h-full bg-navy-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-navy-900 border-b border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider bg-navy-950 px-2 py-0.5 rounded">
                        main.{language === "javascript" ? "js" : language}
                    </span>
                </div>

                <div className="flex gap-1.5">
                    <button
                        onClick={handleReset}
                        className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        title="Reset"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleRunWithCallback}
                        disabled={isRunning}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold"
                    >
                        {isRunning ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Play className="w-3 h-3 fill-current" />
                        )}
                        Chạy
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-0">
                <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        fontFamily: "var(--font-source-code-pro), monospace",
                        lineHeight: 22,
                        padding: { top: 12, bottom: 12 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                    }}
                    loading={
                        <div className="flex justify-center items-center h-full text-slate-500 font-mono text-sm">
                            <div className="animate-pulse flex items-center gap-2">
                                <Code2 className="w-4 h-4" /> Đang tải...
                            </div>
                        </div>
                    }
                />
            </div>

            {/* Console Output */}
            <div className="h-32 bg-[#0d1117] border-t border-slate-800 flex flex-col flex-shrink-0">
                <div className="flex items-center px-3 py-1.5 bg-navy-900/50 border-b border-slate-800/50 text-[11px] font-mono text-slate-500 font-medium">
                    Console
                </div>
                <div className="p-3 flex-1 overflow-y-auto font-mono text-xs">
                    {output === null ? (
                        <span className="text-slate-600 italic">Nhấn "Chạy" để xem kết quả...</span>
                    ) : output.startsWith("Error") ? (
                        <div className="flex items-start gap-2 text-red-400">
                            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <pre className="whitespace-pre-wrap">{output}</pre>
                        </div>
                    ) : (
                        <div className="flex items-start gap-2 text-green-400">
                            <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <pre className="whitespace-pre-wrap">{output}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
