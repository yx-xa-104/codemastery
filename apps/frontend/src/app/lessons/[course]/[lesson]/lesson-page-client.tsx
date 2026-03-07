"use client";

import { Sidebar } from "@/shared/components/layouts/Sidebar";
import { CodeEditor } from "@/features/editor/components/CodeEditor";
import { AiChatDrawer } from "@/features/ai/components/AiChatDrawer";
import { useState, useTransition } from "react";
import { ArrowLeft, Menu, X, CheckCircle, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/shared/lib/supabase/client";
import { Button } from "@/shared/components/ui/button";

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

export function LessonPageClient({ course, lesson, modules, userId, enrollmentId, isInitiallyCompleted = false }: LessonPageClientProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(isInitiallyCompleted);
    const [isPending, startTransition] = useTransition();


    // Determine language from exerciseConfig
    const language = (lesson.exerciseConfig?.language as string) ?? "javascript";
    const initialCode = lesson.exerciseConfig?.starterCode as string
        ?? `// ${lesson.title}\n// Bắt đầu code tại đây\n`;

    const handleMarkComplete = () => {
        if (isCompleted || !userId) return;

        startTransition(async () => {
            const supabase = createClient();
            // Upsert lesson progress using actual schema (status enum, not is_completed bool)
            await (supabase.from('lesson_progress') as any).upsert({
                user_id: userId,
                lesson_id: lesson.id,
                status: 'completed' as const,
                completed_at: new Date().toISOString(),
            }, { onConflict: 'user_id,lesson_id' });

            // Recalculate enrollment progress_percent
            if (enrollmentId) {
                const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
                if (totalLessons > 0) {
                    const { count } = await supabase
                        .from('lesson_progress')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', userId)
                        .eq('status', 'completed');
                    const perc = Math.round(((count ?? 1) / totalLessons) * 100);
                    await (supabase.from('enrollments') as any)
                        .update({ progress_percent: Math.min(100, perc) })
                        .eq('id', enrollmentId);
                }
            }
            setIsCompleted(true);
        });
    };

    return (
        <div className="flex flex-col h-screen bg-[#010816] text-slate-300 overflow-hidden font-sans">
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
                <Button
                    onClick={handleMarkComplete}
                    disabled={isCompleted || isPending || !userId}
                    className={`h-auto px-3 lg:px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-xs lg:text-sm font-semibold ${isCompleted
                        ? 'bg-green-600/20 text-green-400 border border-green-500/30 cursor-default hover:bg-green-600/20'
                        : 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/25 hover:bg-indigo-600 hover:text-white'
                        } disabled:opacity-50`}
                >
                    {isPending
                        ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                        : <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    }
                    <span className="truncate">{isCompleted ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}</span>
                </Button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile backdrop */}
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

                {/* Main content */}
                <div className="flex-1 flex flex-col lg:ml-80 h-full min-w-0">
                    <div className="flex-1 overflow-hidden flex flex-row">
                        {/* Left: Lesson content */}
                        <div className="lg:w-[40%] xl:w-[35%] h-[35vh] lg:h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0">
                            <div className="p-5 lg:p-6">
                                <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                                    <BookOpen className="w-4 h-4" />
                                    Nội dung bài học
                                </div>
                                {lesson.content ? (
                                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-slate-100 prose-p:text-slate-400 prose-p:leading-relaxed prose-pre:bg-[#0B1120] prose-pre:border prose-pre:border-slate-700">
                                        <ReactMarkdown>{lesson.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 italic text-sm">Nội dung bài học đang được cập nhật...</p>
                                )}
                            </div>
                        </div>

                        {/* Right: Code editor */}
                        <div className="flex-1 min-h-0 min-w-0 p-3 lg:p-4">
                            <CodeEditor initialCode={initialCode} language={language} />
                        </div>
                    </div>
                </div>

                {/* AI Chat panel */}
                <AiChatDrawer />
            </div>
        </div>
    );
}
