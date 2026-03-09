"use client";

import { Sidebar } from "@/shared/components/layouts/Sidebar";
import { CodeEditor } from "@/features/editor/components/CodeEditor";
import { AiChatDrawer } from "@/features/ai/components/AiChatDrawer";
import type { TestCase } from "@/features/editor/hooks/useTestRunner";
import { useState, useTransition, useCallback, useEffect } from "react";
import { ArrowLeft, Menu, X, CheckCircle, BookOpen, Loader2, Save, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { apiClient } from "@/shared/lib/api-client";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { LessonContent } from "@/features/lessons/components/LessonContent";

interface LessonModule {
    id: string;
    title: string;
    lessons: {
        id: string;
        title: string;
        slug: string;
        duration: string;
        isCompleted: boolean;
        type: "video" | "interactive";
    }[];
}

interface LessonPageClientProps {
    course: { title: string; slug: string };
    lesson: {
        id: string;
        title: string;
        content: string | null;
        lessonType: string;
        exerciseConfig: Record<string, unknown> | null;
    };
    modules: LessonModule[];
    userId?: string;
    enrollmentId?: string;
    isInitiallyCompleted?: boolean;
}

export function LessonPageClient({ course, lesson, modules, enrollmentId, isInitiallyCompleted = false }: LessonPageClientProps) {
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(isInitiallyCompleted);
    const [isPending, startTransition] = useTransition();
    const [codeSaved, setCodeSaved] = useState(false);
    const [currentCode, setCurrentCode] = useState<string>("");
    const [xpToast, setXpToast] = useState<number | null>(null);
    const [testsPassed, setTestsPassed] = useState(false);

    const language = (lesson.exerciseConfig?.language as string) ?? "javascript";
    const storageKey = `codemastery-code-${lesson.id}`;

    // Extract test cases from exercise config
    const testCases: TestCase[] = (lesson.exerciseConfig?.testCases as TestCase[]) ?? [];
    const hasTests = testCases.length > 0;
    const isCodeExercise = lesson.lessonType === 'code_exercise';

    // Load saved code from localStorage on mount
    const savedCode = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    const initialCode = savedCode
        ?? (lesson.exerciseConfig?.starterCode as string)
        ?? `// ${lesson.title}\n// Bắt đầu code tại đây\n`;

    const handleMarkComplete = () => {
        if (isCompleted) return;
        // For code_exercise with tests, must pass all tests first
        if (isCodeExercise && hasTests && !testsPassed) return;

        startTransition(async () => {
            try {
                await apiClient.post(`/api/enrollments/lessons/${lesson.id}/complete`, {});
                setIsCompleted(true);

                // Show XP toast
                const xpMap: Record<string, number> = { article: 10, code_exercise: 25, quiz: 30 };
                const xp = xpMap[lesson.lessonType] ?? 10;
                setXpToast(xp);
                setTimeout(() => setXpToast(null), 3000);

                router.refresh();
            } catch (err) {
                console.error("Failed to mark lesson complete:", err);
            }
        });
    };

    const handleSaveCode = () => {
        if (!currentCode.trim()) return;
        try {
            localStorage.setItem(storageKey, currentCode);
            setCodeSaved(true);
            setTimeout(() => setCodeSaved(false), 2000);
        } catch (err) {
            console.error("Failed to save code:", err);
        }
    };

    const handleCodeChange = useCallback((code: string) => {
        setCurrentCode(code);
        setCodeSaved(false);
    }, []);

    return (
        <div className="flex flex-col h-screen bg-[#010816] text-slate-300 overflow-hidden font-sans">
            {/* XP Toast */}
            {xpToast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-2 px-5 py-3 bg-amber-500/20 border border-amber-500/40 rounded-xl backdrop-blur-md shadow-lg shadow-amber-500/10">
                        <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="text-amber-300 font-bold text-sm">+{xpToast} XP</span>
                    </div>
                </div>
            )}
            {/* Top Bar */}
            <div className="flex h-14 bg-[#010816] border-b border-slate-800 items-center justify-between px-4 shrink-0 z-50">
                <div className="flex items-center gap-3 min-w-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden h-9 w-9 -ml-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border-0"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                    <Link
                        href={`/courses/${course.slug}`}
                        className="flex size-8 rounded-full bg-slate-800 items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <h1 className="font-bold text-white text-sm lg:text-base tracking-tight truncate">
                        {lesson.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    {/* Save code button */}
                    {lesson.lessonType !== "video" && (
                        <Button
                            onClick={handleSaveCode}
                            disabled={isPending || !currentCode.trim()}
                            className={`h-auto px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-xs font-semibold ${
                                codeSaved
                                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/20"
                                    : "bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-600 hover:text-white"
                            }`}
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                            ) : (
                                <Save className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span className="hidden sm:inline">{codeSaved ? "Đã lưu" : "Lưu code"}</span>
                        </Button>
                    )}
                    {/* Mark complete button */}
                    <Button
                        onClick={handleMarkComplete}
                        disabled={isCompleted || isPending || (isCodeExercise && hasTests && !testsPassed)}
                        title={isCodeExercise && hasTests && !testsPassed ? 'Vượt qua tất cả bài kiểm tra trước' : ''}
                        className={`h-auto px-3 lg:px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-xs lg:text-sm font-semibold ${isCompleted
                            ? 'bg-green-600/20 text-green-400 border border-green-500/30 cursor-default hover:bg-green-600/20'
                            : testsPassed || !hasTests || !isCodeExercise
                                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/25 hover:bg-indigo-600 hover:text-white'
                                : 'bg-slate-800/50 text-slate-500 border border-slate-700 cursor-not-allowed'
                            } disabled:opacity-50`}
                    >
                        {isPending
                            ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                            : <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        }
                        <span className="truncate">{isCompleted ? 'Đã hoàn thành' : 'Hoàn thành'}</span>
                    </Button>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden relative">
                {isSidebarOpen && (
                    <div
                        className="fixed top-14 inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <Sidebar
                    courseTitle={course.title}
                    modules={modules}
                    courseSlug={course.slug}
                    isOpen={isSidebarOpen}
                />

                <div className="flex-1 flex flex-col lg:ml-80 h-full min-w-0">
                    <div className="flex-1 overflow-hidden flex flex-row">
                        {/* Left: Lesson content */}
                        <div className="lg:w-[40%] xl:w-[35%] h-[35vh] lg:h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            <div className="p-5 lg:p-6">
                                <div className="flex items-center gap-2 mb-5 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                                    <BookOpen className="w-4 h-4" />
                                    Nội dung bài học
                                </div>
                                <LessonContent content={lesson.content} />
                            </div>
                        </div>

                        {/* Right: Code editor */}
                        <div className="flex-1 min-h-0 min-w-0 p-3 lg:p-4">
                            <CodeEditor
                                initialCode={initialCode}
                                language={language}
                                onChange={handleCodeChange}
                                testCases={hasTests ? testCases : undefined}
                                onTestResults={(allPassed) => setTestsPassed(allPassed)}
                            />
                        </div>
                    </div>
                </div>

                <AiChatDrawer />
            </div>
        </div>
    );
}
