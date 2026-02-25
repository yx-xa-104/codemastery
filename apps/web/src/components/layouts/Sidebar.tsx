"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    PlayCircle
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Lesson {
    id: string;
    title: string;
    duration: string;
    isCompleted: boolean;
    type: "video" | "interactive" | "quiz";
    slug: string;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface SidebarProps {
    courseTitle: string;
    modules: Module[];
    courseSlug: string;
    isOpen?: boolean;
}

export function Sidebar({ courseTitle, modules, courseSlug, isOpen = false }: SidebarProps) {
    const pathname = usePathname();
    const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const getIconForType = (type: string, isCompleted: boolean) => {
        if (isCompleted) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        if (type === "video") return <PlayCircle className="w-4 h-4 text-slate-400" />;
        return <BookOpen className="w-4 h-4 text-slate-400" />;
    };

    return (
        <div className={`w-80 h-[calc(100vh-56px)] fixed top-14 left-0 bg-navy-950/95 backdrop-blur-xl border-r border-slate-800/80 overflow-y-auto flex flex-col z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-800/80 sticky top-0 bg-navy-950/90 backdrop-blur-md z-10">
                <Link href={`/courses/${courseSlug}`} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 mb-2 transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Về trang khóa học
                </Link>
                <h2 className="text-lg font-bold text-white leading-tight">
                    {courseTitle}
                </h2>

                {/* Course Progress */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                        <span>Tiến độ</span>
                        <span className="text-amber-500">12%</span>
                    </div>
                    <div className="w-full bg-navy-900 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full relative shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                            style={{ width: "12%" }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Modules List */}
            <div className="p-4 space-y-2 flex-grow">
                {modules.map((module, index) => {
                    const isExpanded = expandedModules.includes(module.id);

                    return (
                        <div key={module.id} className="rounded-xl border border-slate-800/50 bg-navy-900/30 overflow-hidden">
                            <button
                                onClick={() => toggleModule(module.id)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                            >
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                                        Chương {index + 1}
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-200">{module.title}</h3>
                                </div>
                                {isExpanded ? (
                                    <ChevronDown className="w-5 h-5 text-slate-400 transition-transform" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-slate-400 transition-transform" />
                                )}
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-3 pb-3 space-y-1">
                                            {module.lessons.map((lesson, lessonIdx) => {
                                                const lessonUrl = `/lessons/${courseSlug}/${lesson.slug}`;
                                                const isActive = pathname === lessonUrl;

                                                return (
                                                    <Link
                                                        key={lesson.id}
                                                        href={lessonUrl}
                                                        className={`group flex items-start gap-3 p-3 rounded-lg text-sm transition-all ${isActive
                                                            ? "bg-indigo-600/20 shadow-[inset_2px_0_0_0_#6366f1]"
                                                            : "hover:bg-white/5"
                                                            }`}
                                                    >
                                                        <div className="mt-0.5">
                                                            {getIconForType(lesson.type, lesson.isCompleted)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className={`font-medium line-clamp-2 ${isActive ? "text-indigo-300" : "text-slate-300 group-hover:text-white"}`}>
                                                                {lessonIdx + 1}. {lesson.title}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                                                                <span className="flex items-center gap-1">
                                                                    {lesson.type === 'video' ? <PlayCircle className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                                                                    {lesson.duration}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
