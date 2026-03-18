"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, EyeOff, Lock, Lightbulb } from "lucide-react";
import type { TestCaseResult, TestCase } from "../hooks/useTestRunner";

interface TestResultsPanelProps {
    results: TestCaseResult[];
    totalTests: number;
    isRunning: boolean;
    testCases?: TestCase[];
}

export function TestResultsPanel({ results, totalTests, isRunning, testCases = [] }: TestResultsPanelProps) {
    const passedCount = results.filter(r => r.passed).length;
    const [selectedTest, setSelectedTest] = useState<number | null>(null);

    // Auto-select first failed test when results change, or first test
    useEffect(() => {
        if (results.length > 0) {
            const firstFailed = results.findIndex(r => !r.passed);
            setSelectedTest(firstFailed >= 0 ? firstFailed : 0);
        }
    }, [results]);

    const hasResults = results.length > 0;
    const activeIdx = selectedTest ?? 0;
    const activeResult = results[activeIdx];
    const activeTestCase = testCases[activeIdx];

    // Pre-run: show hints for visible test cases
    const visibleTestCases = testCases.filter(tc => !tc.hidden);

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* Summary bar */}
            {hasResults && (
                <div className={`flex items-center px-3 py-1.5 text-xs font-medium border-b border-slate-800/30 shrink-0 ${
                    passedCount === totalTests
                        ? "bg-green-500/10 text-green-400"
                        : "bg-amber-500/10 text-amber-400"
                }`}>
                    {passedCount === totalTests
                        ? "✓ Toàn bộ kiểm thử thành công."
                        : `${passedCount}/${totalTests} test passed`}
                    {isRunning && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                </div>
            )}

            {/* Pre-run: Show test case hints */}
            {!hasResults && !isRunning && testCases.length > 0 && (
                <div className="flex flex-1 overflow-hidden">
                    {/* Left: Sample test tabs */}
                    <div className="w-28 shrink-0 border-r border-slate-800/30 overflow-y-auto">
                        {testCases.map((tc, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedTest(i)}
                                className={`w-full flex items-center gap-1.5 px-2.5 py-2 text-[11px] font-medium transition-colors border-b border-slate-800/20 ${
                                    activeIdx === i
                                        ? "bg-slate-800/60 text-white"
                                        : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-300"
                                }`}
                            >
                                <Lightbulb className={`w-3 h-3 shrink-0 ${tc.hidden ? "text-slate-600" : "text-amber-400/60"}`} />
                                <span>Test {i + 1}</span>
                                {tc.hidden && <Lock className="w-2.5 h-2.5 text-slate-600 shrink-0 ml-auto" />}
                            </button>
                        ))}
                    </div>

                    {/* Right: Test case preview */}
                    <div className="flex-1 overflow-y-auto p-3 text-xs font-mono">
                        {activeTestCase ? (
                            activeTestCase.hidden ? (
                                <div className="flex items-center gap-2 text-slate-500 italic">
                                    <Lock className="w-3.5 h-3.5" />
                                    Test case ẩn — chạy kiểm tra để xem kết quả
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400/80 mb-3">
                                        <Lightbulb className="w-3.5 h-3.5" />
                                        <span className="font-sans font-medium">Gợi ý: Input / Output mẫu</span>
                                    </div>
                                    <DetailRow label="Đầu vào" value={activeTestCase.input || "(trống)"} />
                                    <DetailRow
                                        label="Đầu ra mong đợi"
                                        value={activeTestCase.expectedOutput}
                                        color="text-green-300/70"
                                    />
                                    <div className="mt-4 px-3 py-2 bg-slate-800/30 rounded-lg border border-slate-700/30">
                                        <p className="text-[11px] text-slate-400 font-sans">
                                            💡 Nhấn <span className="text-indigo-300 font-medium">&quot;Kiểm tra&quot;</span> để chạy code với các test case này.
                                        </p>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="text-slate-500 italic font-sans">
                                Chọn test case để xem gợi ý
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* No test cases at all */}
            {!hasResults && !isRunning && testCases.length === 0 && (
                <div className="text-slate-600 italic text-xs p-3">
                    Nhấn &quot;Kiểm tra&quot; để chạy test cases...
                </div>
            )}

            {/* Post-run: Show results */}
            {hasResults && (
                <div className="flex flex-1 overflow-hidden">
                    {/* Left: Test case tabs */}
                    <div className="w-28 shrink-0 border-r border-slate-800/30 overflow-y-auto">
                        {Array.from({ length: totalTests }).map((_, i) => {
                            const r = results[i];
                            const isActive = activeIdx === i;

                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedTest(i)}
                                    className={`w-full flex items-center gap-1.5 px-2.5 py-2 text-[11px] font-medium transition-colors border-b border-slate-800/20 ${
                                        isActive
                                            ? "bg-slate-800/60 text-white"
                                            : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-300"
                                    }`}
                                >
                                    {!r ? (
                                        isRunning ? (
                                            <Loader2 className="w-3 h-3 animate-spin text-slate-500 shrink-0" />
                                        ) : (
                                            <div className="w-3 h-3 rounded-full border border-slate-600 shrink-0" />
                                        )
                                    ) : r.passed ? (
                                        <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                                    ) : (
                                        <XCircle className="w-3 h-3 text-red-400 shrink-0" />
                                    )}
                                    <span>Kiểm thử {i + 1}</span>
                                    {r?.hidden && <Lock className="w-2.5 h-2.5 text-slate-600 shrink-0 ml-auto" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right: Test detail */}
                    <div className="flex-1 overflow-y-auto p-3 text-xs font-mono">
                        {activeResult ? (
                            activeResult.hidden && !activeResult.passed ? (
                                <div className="flex items-center gap-2 text-red-400/70 italic">
                                    <EyeOff className="w-3.5 h-3.5" />
                                    Test case ẩn — output không khớp
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    <DetailRow label="Đầu vào" value={activeResult.input || "(trống)"} />
                                    <DetailRow
                                        label="Đầu ra thực tế"
                                        value={activeResult.error
                                            ? `❌ ${activeResult.error}`
                                            : activeResult.actualOutput || "(trống)"}
                                        color={activeResult.passed ? "text-green-300" : "text-red-300"}
                                    />
                                    <DetailRow
                                        label="Đầu ra mong đợi"
                                        value={activeResult.expectedOutput}
                                        color="text-green-300/70"
                                    />
                                    <DetailRow label="Giới hạn thời gian" value="5000 ms" />
                                    {activeResult.executionTime !== undefined && (
                                        <DetailRow label="Thời gian thực thi" value={`${activeResult.executionTime} ms`} />
                                    )}
                                    <DetailRow
                                        label="Mô tả"
                                        value={activeResult.passed ? "Right answer" : activeResult.error ? "Runtime Error" : "Wrong answer"}
                                        color={activeResult.passed ? "text-green-400" : "text-red-400"}
                                    />
                                </div>
                            )
                        ) : (
                            <div className="text-slate-500 italic">
                                {isRunning ? "Đang chạy..." : "Chọn test case để xem chi tiết"}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailRow({ label, value, color }: { label: string; value: string; color?: string }) {
    return (
        <div className="flex gap-3">
            <span className="text-slate-500 w-32 shrink-0 text-[11px]">{label}</span>
            <pre className={`whitespace-pre-wrap break-all flex-1 ${color ?? "text-slate-300"}`}>
                {value}
            </pre>
        </div>
    );
}
