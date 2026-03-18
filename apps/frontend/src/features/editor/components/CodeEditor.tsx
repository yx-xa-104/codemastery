"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, AlertTriangle, CheckCircle, Code2, Clock, GripHorizontal, FlaskConical, Terminal } from "lucide-react";
import { useCodeRunner } from "@/features/editor/hooks/useCodeRunner";
import { useTestRunner, type TestCase } from "@/features/editor/hooks/useTestRunner";
import { TestResultsPanel } from "./TestResultsPanel";

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
    testCases?: TestCase[];
    onTestResults?: (allPassed: boolean) => void;
}

export function CodeEditor({
    initialCode = "// Code here...",
    language: defaultLang = "javascript",
    onRun,
    onChange,
    testCases,
    onTestResults,
}: CodeEditorProps) {
    const { code, setCode, stdinValue, setStdinValue, result, isRunning, handleRun, handleReset } = useCodeRunner(initialCode);
    const testRunner = useTestRunner();
    const [selectedLang, setSelectedLang] = useState(defaultLang);
    const [consoleHeight, setConsoleHeight] = useState(DEFAULT_CONSOLE_H);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startH = useRef(DEFAULT_CONSOLE_H);

    const hasTests = testCases && testCases.length > 0;
    // Tab: "console" or "tests"
    const [activeTab, setActiveTab] = useState<"console" | "tests" | "input">(hasTests ? "tests" : "console");

    const handleRunWithCallback = async () => {
        setActiveTab("console");
        await handleRun(selectedLang);
        if (onRun) onRun(code);
    };

    const handleRunTests = async () => {
        if (!hasTests) return;
        setActiveTab("tests");
        await testRunner.runTests(code, selectedLang, testCases);
    };

    // Notify parent when test results change
    useEffect(() => {
        if (onTestResults && hasTests) {
            onTestResults(testRunner.allPassed);
        }
    }, [testRunner.allPassed, onTestResults, hasTests]);

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
                        disabled={isRunning || testRunner.isRunning}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold"
                    >
                        {isRunning ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Play className="w-3 h-3 fill-current" />
                        )}
                        {isRunning ? "Đang chạy..." : "Chạy"}
                    </button>
                    {hasTests && (
                        <button
                            onClick={handleRunTests}
                            disabled={isRunning || testRunner.isRunning}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold"
                        >
                            {testRunner.isRunning ? (
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <FlaskConical className="w-3 h-3" />
                            )}
                            {testRunner.isRunning ? "Đang kiểm tra..." : "Kiểm tra"}
                        </button>
                    )}
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

            {/* Console / Test Results Panel — tabbed */}
            <div
                style={{ height: consoleHeight }}
                className="bg-[#0d1117] flex flex-col shrink-0"
            >
                {hasTests ? (
                    <>
                        {/* Tab Bar */}
                        <div className="flex border-b border-slate-800/50 shrink-0">
                            <button
                                onClick={() => setActiveTab("console")}
                                className={`px-4 py-1.5 text-[11px] font-mono font-medium transition-colors border-b-2 ${
                                    activeTab === "console"
                                        ? "text-slate-300 border-indigo-500"
                                        : "text-slate-600 border-transparent hover:text-slate-400"
                                }`}
                            >
                                Console
                            </button>
                            <button
                                onClick={() => setActiveTab("tests")}
                                className={`px-4 py-1.5 text-[11px] font-mono font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                                    activeTab === "tests"
                                        ? "text-slate-300 border-emerald-500"
                                        : "text-slate-600 border-transparent hover:text-slate-400"
                                }`}
                            >
                                Kiểm tra
                                {testRunner.results.length > 0 && (
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                        testRunner.allPassed
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-red-500/20 text-red-400"
                                    }`}>
                                        {testRunner.results.filter(r => r.passed).length}/{testCases.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("input")}
                                className={`px-4 py-1.5 text-[11px] font-mono font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                                    activeTab === "input"
                                        ? "text-slate-300 border-amber-500"
                                        : "text-slate-600 border-transparent hover:text-slate-400"
                                }`}
                            >
                                <Terminal className="w-3 h-3" />
                                Input
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === "console" ? (
                            <ConsoleOutput result={result} />
                        ) : activeTab === "input" ? (
                            <StdinInput value={stdinValue} onChange={setStdinValue} />
                        ) : (
                            <TestResultsPanel
                                results={testRunner.results}
                                totalTests={testCases.length}
                                isRunning={testRunner.isRunning}
                                testCases={testCases}
                            />
                        )}
                    </>
                ) : (
                                    <>
                        <div className="flex items-center justify-between border-b border-slate-800/50 shrink-0">
                            <div className="flex">
                                <button
                                    onClick={() => setActiveTab("console")}
                                    className={`px-4 py-1.5 text-[11px] font-mono font-medium transition-colors border-b-2 ${
                                        activeTab === "console"
                                            ? "text-slate-300 border-indigo-500"
                                            : "text-slate-600 border-transparent hover:text-slate-400"
                                    }`}
                                >
                                    Console
                                </button>
                                <button
                                    onClick={() => setActiveTab("input")}
                                    className={`px-4 py-1.5 text-[11px] font-mono font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                                        activeTab === "input"
                                            ? "text-slate-300 border-amber-500"
                                            : "text-slate-600 border-transparent hover:text-slate-400"
                                    }`}
                                >
                                    <Terminal className="w-3 h-3" />
                                    Input
                                </button>
                            </div>
                            {result?.executionTime !== undefined && (
                                <span className="flex items-center gap-1 text-slate-600 text-[11px] font-mono pr-3">
                                    <Clock className="w-3 h-3" /> {result.executionTime}ms
                                </span>
                            )}
                        </div>
                        {activeTab === "input" ? (
                            <StdinInput value={stdinValue} onChange={setStdinValue} />
                        ) : (
                            <ConsoleOutput result={result} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// Extracted console output
function ConsoleOutput({ result }: { result: { output: string; error?: string; executionTime?: number; htmlPreview?: string } | null }) {
    return (
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
    );
}

// Stdin input panel
function StdinInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={"Nhập dữ liệu đầu vào ở đây...\nMỗi dòng = 1 lần gọi prompt() / input()\n\nVí dụ:\n3\n5"}
                spellCheck={false}
                className="flex-1 w-full p-3 bg-transparent text-green-300 font-mono text-xs resize-none focus:outline-none placeholder:text-slate-600 placeholder:italic"
            />
        </div>
    );
}
