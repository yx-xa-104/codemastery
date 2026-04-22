"use client";

import { Sidebar } from "@/shared/components/layouts/Sidebar";
import { CodeEditor } from "@/features/editor/components/CodeEditor";
import { AiChatDrawer } from "@/features/ai/components/AiChatDrawer";
import { ClassroomDiscussionDrawer } from "@/features/lessons/components/ClassroomDiscussionDrawer";
import { QuizPanel } from "@/features/lessons/components/QuizPanel";
import type { TestCase } from "@/features/editor/hooks/useTestRunner";
import { useState, useTransition, useCallback, useEffect } from "react";
import { ArrowLeft, Menu, X, CheckCircle, BookOpen, Loader2, Save, Zap, MessageSquare } from "lucide-react";
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
    course: { id: string; title: string; slug: string };
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
    quizQuestions?: any[];
}

export function LessonPageClient({ course, lesson, modules, enrollmentId, isInitiallyCompleted = false, quizQuestions = [] }: LessonPageClientProps) {
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(isInitiallyCompleted);
    const [isPending, startTransition] = useTransition();
    const [codeSaved, setCodeSaved] = useState(false);
    const [currentCode, setCurrentCode] = useState<string>("");
    const [lastSavedCode, setLastSavedCode] = useState<string | null>(null);
    const [xpToast, setXpToast] = useState<number | null>(null);
    const [testsPassed, setTestsPassed] = useState(false);
    const [quizPassed, setQuizPassed] = useState(false);
    const [isDiscussionOpen, setDiscussionOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const hasQuiz = quizQuestions.length > 0;

    const language = (lesson.exerciseConfig?.language as string) ?? "javascript";
    const storageKey = `codemastery-code-${lesson.id}`;

    // Extract test cases from exercise config
    const testCases: TestCase[] = (lesson.exerciseConfig?.testCases as TestCase[]) ?? [];
    const hasTests = testCases.length > 0;
    const isCodeExercise = lesson.lessonType === 'code_exercise';
    const needsQuizPass = hasQuiz && !quizPassed;

    // Load saved code from localStorage on mount and sync state
    useEffect(() => {
        const savedCode = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
        const initialCode = savedCode
            ?? (lesson.exerciseConfig?.starterCode as string)
            ?? `// ${lesson.title}\n// Bắt đầu code tại đây\n`;
        setCurrentCode(initialCode);
        setLastSavedCode(initialCode);
        setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey]);

    const handleMarkComplete = () => {
        if (isCompleted || isPending) return;
        // If there's a quiz, only the quiz needs to be passed.
        // Otherwise, if it's a code exercise with tests, all tests must be passed.
        if (hasQuiz) {
            if (!quizPassed) return;
        } else if (isCodeExercise && hasTests) {
            if (!testsPassed) return;
        }

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
        if (!currentCode.trim() || currentCode === lastSavedCode) return;
        try {
            localStorage.setItem(storageKey, currentCode);
            setLastSavedCode(currentCode);
            setCodeSaved(true);
            setTimeout(() => setCodeSaved(false), 2000);
        } catch (err) {
            console.error("Failed to save code:", err);
        }
    };

    const handleCodeChange = useCallback((code: string) => {
        setCurrentCode(code);
    }, []);

    const isCodeChanged = currentCode !== lastSavedCode && currentCode.trim() !== "";

    return (
        <div className="flex flex-col h-[100dvh] bg-background text-slate-200 overflow-hidden font-sans">
            {/* Global Abstract Background */}
            <div className="fixed inset-0 pointer-events-none bg-size-[24px_24px] bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] z-0" />
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

            
            {/* XP Toast */}
            {xpToast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-amber-500/20 rounded-2xl backdrop-blur-xl shadow-2xl">
                        <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="text-zinc-100 font-bold text-sm">+{xpToast} XP</span>
                    </div>
                </div>
            )}
            {/* Top Bar */}
            <div className="flex h-14 bg-navy-950/80 backdrop-blur-md border-b border-white/10 items-center justify-between px-4 shrink-0 z-50">
                <div className="flex items-center gap-3 min-w-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden h-9 w-9 -ml-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border-0"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                    <Link
                        href={`/courses/${course.slug}`}
                        className="flex size-8 rounded-full border border-white/10 bg-background items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <h1 className="font-bold text-zinc-100 text-sm lg:text-base tracking-tight truncate">
                        {lesson.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => setDiscussionOpen(true)}
                        className="h-auto px-3 py-2 rounded-lg text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 border border-indigo-500/20 transition-colors flex items-center gap-1.5 text-xs font-semibold mr-1"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">Hỏi đáp</span>
                    </Button>
                    {/* Save code button */}
                    {lesson.lessonType !== "video" && !hasQuiz && (
                        <Button
                            onClick={handleSaveCode}
                            disabled={isPending || !isCodeChanged}
                            className={`h-auto px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-xs font-semibold ${
                                codeSaved
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : isCodeChanged
                                        ? "bg-white text-black border border-white hover:bg-zinc-200"
                                        : "bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed"
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
                        disabled={isCompleted || isPending || (hasQuiz ? !quizPassed : (isCodeExercise && hasTests && !testsPassed))}
                        title={hasQuiz ? (!quizPassed ? 'Trả lời đúng tất cả câu hỏi trước' : '') : (isCodeExercise && hasTests && !testsPassed ? 'Vượt qua tất cả bài kiểm tra trước' : '')}
                        className={`h-auto px-3 lg:px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-xs lg:text-sm font-semibold ${isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default hover:bg-emerald-500/10'
                            : (hasQuiz ? quizPassed : (testsPassed || !hasTests || !isCodeExercise))
                                ? 'bg-indigo-600 text-slate-50 border border-indigo-500 hover:bg-indigo-500 shadow-glow-indigo'
                                : 'bg-white/5 text-slate-400 border border-white/10 cursor-not-allowed'
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
                    <div className="flex-1 overflow-hidden flex flex-row h-full">
                        {/* Left: Lesson content */}
                        <div className="lg:w-[40%] xl:w-[35%] h-[35vh] lg:h-full relative border-b lg:border-b-0 lg:border-r border-white/10 shrink-0">
                            <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600 scrollbar-track-transparent">
                                <div className="p-5 lg:p-6 min-h-full">
                                <div className="flex items-center gap-2 mb-6 text-xs font-semibold text-slate-400 uppercase tracking-widest border border-white/10 w-fit px-3 py-1.5 rounded-full bg-white/5">
                                    <BookOpen className="w-4 h-4" />
                                    Nội dung bài học
                                </div>
                                <LessonContent content={lesson.content} />
                                </div>
                            </div>
                        </div>

                        {/* Right: Code editor or Quiz */}
                        <div className="flex-1 min-h-0 min-w-0 flex flex-col h-full relative">
                            <div className="absolute inset-0">
                            {hasQuiz ? (
                                <QuizPanel
                                    questions={quizQuestions}
                                    onQuizComplete={(allCorrect) => setQuizPassed(allCorrect)}
                                    isCompleted={isCompleted}
                                />
                            ) : isLoaded ? (
                                <div className="p-3 lg:p-4 h-full">
                                    <CodeEditor
                                        initialCode={currentCode}
                                        language={language}
                                        onChange={handleCodeChange}
                                        testCases={hasTests ? testCases : undefined}
                                        onTestResults={(allPassed) => {
                                            setTestsPassed(allPassed);
                                            if (allPassed) {
                                                import('canvas-confetti').then((confetti) => {
                                                    const duration = 3000;
                                                    const end = Date.now() + duration;

                                                    const frame = () => {
                                                        confetti.default({
                                                            particleCount: 5,
                                                            angle: 60,
                                                            spread: 55,
                                                            origin: { x: 0 },
                                                            colors: ['#6366f1', '#f59e0b', '#10b981']
                                                        });
                                                        confetti.default({
                                                            particleCount: 5,
                                                            angle: 120,
                                                            spread: 55,
                                                            origin: { x: 1 },
                                                            colors: ['#6366f1', '#f59e0b', '#10b981']
                                                        });

                                                        if (Date.now() < end) {
                                                            requestAnimationFrame(frame);
                                                        }
                                                    };
                                                    frame();
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-full text-slate-500 font-mono text-sm">
                                    <div className="animate-pulse flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </div>

                <ClassroomDiscussionDrawer courseId={course.id} isOpen={isDiscussionOpen} onClose={() => setDiscussionOpen(false)} />
                <AiChatDrawer />
            </div>
        </div>
    );
}
