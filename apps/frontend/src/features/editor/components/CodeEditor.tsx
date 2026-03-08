"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, AlertTriangle, CheckCircle, Code2, Clock, GripHorizontal } from "lucide-react";
import { useCodeRunner } from "@/features/editor/hooks/useCodeRunner";

const LANGUAGE_OPTIONS = [
    { label: "JavaScript", value: "javascript", ext: "js" },
    { label: "TypeScript", value: "typescript", ext: "ts" },
    { label: "Python", value: "python", ext: "py" },
    { label: "Java", value: "java", ext: "java" },
    { label: "C++", value: "cpp", ext: "cpp" },
    { label: "C#", value: "csharp", ext: "cs" },
    { label: "PHP", value: "php", ext: "php" },
    { label: "Pascal", value: "pascal", ext: "pas" },
    { label: "HTML", value: "html", ext: "html" },
    { label: "CSS", value: "css", ext: "css" },
    { label: "SQL (SQLite)", value: "sql", ext: "sql" },
    { label: "PostgreSQL", value: "postgresql", ext: "sql" },
    { label: "MySQL", value: "mysql", ext: "sql" },
    { label: "SQL Server", value: "sqlserver", ext: "sql" },
];

const MIN_CONSOLE_H = 80;
const DEFAULT_CONSOLE_H = 160;

interface CodeEditorProps {
    initialCode?: string;
    language?: string;
    onRun?: (code: string) => void;
    onChange?: (code: string) => void;
}

export function CodeEditor({
    initialCode = "// Code here...",
    language: defaultLang = "javascript",
    onRun,
    onChange,
}: CodeEditorProps) {
    const { code, setCode, result, isRunning, handleRun, handleReset } = useCodeRunner(initialCode);
    const [selectedLang, setSelectedLang] = useState(defaultLang);
    const [consoleHeight, setConsoleHeight] = useState(DEFAULT_CONSOLE_H);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startH = useRef(DEFAULT_CONSOLE_H);

    const handleRunWithCallback = async () => {
        await handleRun(selectedLang);
        if (onRun) onRun(code);
    };

    // Drag-to-resize handlers
    const onMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        startY.current = e.clientY;
        startH.current = consoleHeight;
        document.body.style.cursor = "ns-resize";
        document.body.style.userSelect = "none";
    }, [consoleHeight]);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || !containerRef.current) return;
            const delta = startY.current - e.clientY;
            const maxH = containerRef.current.clientHeight * 0.7;
            const newH = Math.max(MIN_CONSOLE_H, Math.min(maxH, startH.current + delta));
            setConsoleHeight(newH);
        };

        const onMouseUp = () => {
            if (isDragging.current) {
                isDragging.current = false;
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
            }
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    const langopt = LANGUAGE_OPTIONS.find(l => l.value === selectedLang) ?? LANGUAGE_OPTIONS[0];

    return (
        <div ref={containerRef} className="flex flex-col h-full bg-navy-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-navy-900 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider bg-navy-950 px-2 py-0.5 rounded">
                        main.{langopt.ext}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={selectedLang}
                        onChange={e => setSelectedLang(e.target.value)}
                        className="bg-[#0d1117] border border-slate-700 text-slate-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-indigo-500"
                    >
                        {LANGUAGE_OPTIONS.map(l => (
                            <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                    </select>
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
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Play className="w-3 h-3 fill-current" />
                        )}
                        {isRunning ? "Đang chạy..." : "Chạy"}
                    </button>
                </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0">
                <Editor
                    height="100%"
                    language={selectedLang}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => { setCode(val || ""); onChange?.(val || ""); }}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                        lineHeight: 22,
                        padding: { top: 12, bottom: 12 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                        tabSize: 4,
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

            {/* Resize Handle */}
            <div
                onMouseDown={onMouseDown}
                className="h-2 bg-navy-900/80 border-t border-b border-slate-800/50 cursor-ns-resize flex items-center justify-center shrink-0 hover:bg-indigo-500/10 transition-colors group"
            >
                <GripHorizontal className="w-4 h-3 text-slate-700 group-hover:text-indigo-400 transition-colors" />
            </div>

            {/* Console Output — resizable */}
            <div
                style={{ height: consoleHeight }}
                className="bg-[#0d1117] flex flex-col shrink-0"
            >
                <div className="flex items-center justify-between px-3 py-1.5 bg-navy-900/50 border-b border-slate-800/50 text-[11px] font-mono text-slate-500 font-medium shrink-0">
                    <span>Console</span>
                    {result?.executionTime !== undefined && (
                        <span className="flex items-center gap-1 text-slate-600">
                            <Clock className="w-3 h-3" /> {result.executionTime}ms
                        </span>
                    )}
                </div>
                <div className="p-3 flex-1 overflow-y-auto font-mono text-xs relative">
                    {!result ? (
                        <span className="text-slate-600 italic">Nhấn &quot;Chạy&quot; để xem kết quả...</span>
                    ) : result.htmlPreview ? (
                        <iframe
                            srcDoc={result.htmlPreview}
                            title="preview"
                            sandbox="allow-scripts"
                            className="w-full h-full border-none bg-white rounded"
                        />
                    ) : (
                        <div className="space-y-1">
                            {result.output && (
                                <div className="flex items-start gap-2 text-green-400">
                                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <pre className="whitespace-pre-wrap">{result.output}</pre>
                                </div>
                            )}
                            {result.error && (
                                <div className="flex items-start gap-2 text-red-400">
                                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <pre className="whitespace-pre-wrap">{result.error}</pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

