"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronDown, CheckCircle2, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";

interface LessonItem {
    id: string;
    title: string;
    slug: string;
    duration: string;
    isCompleted: boolean;
    type: "video" | "interactive";
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
            className={`fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-80 bg-[#0B1120] border-r border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            {/* Course header */}
            <div className="p-4 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                    <h2 className="text-sm font-bold text-white truncate">{courseTitle}</h2>
                </div>
                {/* Progress */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        {completedLessons}/{totalLessons}
                    </span>
                </div>
            </div>

            {/* Modules list */}
            <div className="flex-1 overflow-y-auto">
                {modules.map((mod, idx) => (
                    <div key={mod.id}>
                        <Button
                            variant="ghost"
                            onClick={() => toggleModule(mod.id)}
                            className="w-full flex items-center justify-between px-4 py-6 rounded-none text-left hover:bg-white/5 transition-colors"
                        >
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Module {idx + 1}: {mod.title}
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 text-slate-500 transition-transform ${expandedModules[mod.id] ? "rotate-180" : ""
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
                                                href={lessonPath}
                                                className={`flex items-start gap-3 px-4 py-2.5 text-sm transition-colors ${isActive
                                                    ? "bg-indigo-500/10 text-white border-l-2 border-indigo-500"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                                                    }`}
                                            >
                                                {lesson.isCompleted ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                ) : (
                                                    <PlayCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                                                )}
                                                <div className="min-w-0">
                                                    <span className="block truncate">{lesson.title}</span>
                                                    <span className="text-xs text-slate-600">{lesson.duration}</span>
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
