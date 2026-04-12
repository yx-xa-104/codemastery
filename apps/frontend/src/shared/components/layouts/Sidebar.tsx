"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronDown, CheckCircle2, PlayCircle, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";

interface LessonItem {
    id: string;
    title: string;
    slug: string;
    duration: string;
    isCompleted: boolean;
    type: "video" | "interactive";
    isLocked?: boolean;
}

interface SidebarModule {
    id: string;
    title: string;
    lessons: LessonItem[];
}

interface SidebarProps {
    courseTitle: string;
    modules: SidebarModule[];
    courseSlug: string;
    isOpen: boolean;
}

export function Sidebar({ courseTitle, modules, courseSlug, isOpen }: SidebarProps) {
    const pathname = usePathname();
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        modules.forEach((m) => {
            initial[m.id] = true;
        });
        return initial;
    });

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedLessons = modules.reduce(
        (sum, m) => sum + m.lessons.filter((l) => l.isCompleted).length,
        0
    );
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
        <aside
            className={`fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-80 bg-navy-950 border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            {/* Course header */}
            <div className="p-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-zinc-400 shrink-0" />
                    <h2 className="text-sm font-bold text-zinc-100 truncate">{courseTitle}</h2>
                </div>
                {/* Progress */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-zinc-400 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="text-xs text-zinc-500 font-bold whitespace-nowrap tracking-wider">
                        {completedLessons}/{totalLessons}
                    </span>
                </div>
            </div>

            {/* Modules list */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {modules.map((mod, idx) => (
                    <div key={mod.id}>
                        <Button
                            variant="ghost"
                            onClick={() => toggleModule(mod.id)}
                            className="w-full flex items-center justify-between px-4 py-6 rounded-none text-left hover:bg-white/[0.02] transition-colors h-auto"
                        >
                            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest whitespace-normal">
                                MODULE {idx + 1}: {mod.title}
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 text-zinc-500 transition-transform flex-shrink-0 ml-2 ${expandedModules[mod.id] ? "rotate-180" : ""
                                    }`}
                            />
                        </Button>

                        {expandedModules[mod.id] && (
                            <ul className="pb-2">
                                {mod.lessons.map((lesson) => {
                                    const lessonPath = `/lessons/${courseSlug}/${lesson.slug}`;
                                    const isActive = pathname === lessonPath;

                                    return (
                                        <li key={lesson.id}>
                                            <Link
                                                href={lesson.isLocked ? '#' : lessonPath}
                                                onClick={(e) => {
                                                    if (lesson.isLocked) {
                                                        e.preventDefault();
                                                        alert('Bạn cần ghi danh khóa học để xem bài học này.');
                                                    }
                                                }}
                                                className={`flex items-start gap-3 px-5 py-3 text-sm transition-colors ${lesson.isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${isActive
                                                    ? "bg-white/5 text-white border-l-2 border-zinc-400"
                                                    : "text-zinc-400 hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent"
                                                    }`}
                                            >
                                                {lesson.isLocked ? (
                                                    <Lock className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                                                ) : lesson.isCompleted ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                ) : (
                                                    <PlayCircle className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <span className={`block truncate font-medium ${isActive ? 'text-zinc-100' : ''}`}>{lesson.title}</span>
                                                    <span className="text-[10px] text-zinc-500 font-semibold">{lesson.duration}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
}
