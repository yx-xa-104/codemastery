"use client";

import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle, Code2, ArrowRight } from "lucide-react";

interface LessonLinkProps {
    courseSlug: string;
    lesson: any;
    lessonIdx: number;
    hasAccess: boolean;
    isCompleted: boolean;
    isEnrolled: boolean;
    totalLessons: number;
}

export function LessonLink({ courseSlug, lesson, lessonIdx, hasAccess, isCompleted, isEnrolled, totalLessons }: LessonLinkProps) {
    return (
        <Link
            href={hasAccess ? `/lessons/${courseSlug}/${lesson.slug ?? lesson.id}` : '#'}
            onClick={(e) => {
                if (!hasAccess) {
                    e.preventDefault();
                    alert('Bạn cần ghi danh khóa học (và cập nhật mã sinh viên/mã lớp) để xem bài học này.');
                }
            }}
            className={`flex items-center justify-between p-4 transition-all group ${hasAccess ? "hover:bg-white/5 cursor-pointer" : "opacity-60 cursor-not-allowed"} ${lessonIdx !== totalLessons - 1 ? "border-b border-slate-800/50" : ""}`}
        >
            <div className="flex items-center gap-3 w-full pr-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                        ? 'bg-green-500/20 border border-green-500/30'
                        : hasAccess ? 'bg-navy-950 border border-slate-800 group-hover:bg-indigo-600/20 group-hover:border-indigo-500/30'
                        : 'bg-navy-950 border border-slate-800/50'
                }`}>
                    {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : !hasAccess ? (
                        <Lock className="w-4 h-4 text-slate-500" />
                    ) : lesson.lesson_type === 'video' ? (
                        <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    ) : (
                        <Code2 className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                    )}
                </div>
                <span className={`text-sm font-medium transition-colors truncate flex-1 ${hasAccess ? "text-slate-300 group-hover:text-white" : "text-slate-500"}`}>
                    {lessonIdx + 1}. {lesson.title}
                </span>
                {lesson.is_free_preview && !isEnrolled && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 ml-2">
                        Học thử
                    </span>
                )}
            </div>
            <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs text-slate-500 font-mono tracking-wide">
                    {lesson.duration_minutes ? `${lesson.duration_minutes}:00` : '—'}
                </span>
                {hasAccess && (
                    <ArrowRight className="w-4 h-4 text-slate-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-indigo-400 transition-all duration-300" />
                )}
            </div>
        </Link>
    );
}
