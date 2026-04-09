import Link from "next/link";
import { Clock, BookOpen, ArrowRight, Flame } from "lucide-react";
import type { CourseLevel } from "@/shared/lib/supabase/database.types";

const levelMap: Record<CourseLevel, string> = {
    beginner: 'Cơ bản',
    intermediate: 'Trung bình',
    advanced: 'Nâng cao',
};

const levelStyles: Record<CourseLevel, string> = {
    beginner: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    intermediate: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
    advanced: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
};

interface CourseCardProps {
    title: string;
    category: string;
    level: CourseLevel;
    duration: string;
    lessons: number;
    image: string;
    progress?: number;
    slug: string;
    isHot?: boolean;
    teacherName?: string;
}

export function CourseCard({
    title,
    category,
    level,
    duration,
    lessons,
    image,
    progress,
    slug,
    isHot,
    teacherName,
}: CourseCardProps) {
    return (
        <div className="group glass rounded-2xl overflow-hidden flex flex-col h-full relative border border-white/5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-glow-indigo hover:-translate-y-2">
            {/* Badges */}
            {isHot && (
                <div className="absolute top-4 right-4 z-10 bg-red-500/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-red-400/30 flex items-center gap-1.5 shadow-lg">
                    <Flame className="w-3 h-3" />
                    HOT
                </div>
            )}
            {progress === 0 && !isHot && (
                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    New
                </div>
            )}

            {/* Image Container */}
            <div className="h-52 relative overflow-hidden bg-[#010816] border-b border-white/5">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#010816] to-transparent"></div>
            </div>

            <div className="p-6 flex flex-col grow relative z-10 bg-[#060D1F]/40 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold tracking-wider text-indigo-300 uppercase bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                        {category}
                    </span>
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded border ${levelStyles[level]}`}>
                        {levelMap[level]}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors leading-tight">
                    {title}
                </h3>
                
                {teacherName && (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-400 mb-4">
                        Giảng viên: <span className="text-slate-300">{teacherName}</span>
                    </div>
                )}

                <div className="flex gap-4 text-sm text-slate-400 mb-6 flex-1">
                    <div className="flex items-center gap-1.5 border border-slate-700/30 px-2 py-1 rounded-md bg-white/5">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="font-mono text-xs">{duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 border border-slate-700/30 px-2 py-1 rounded-md bg-white/5">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                        <span className="font-mono text-xs">{lessons} bài</span>
                    </div>
                </div>

                <div className="mt-auto pt-5 border-t border-slate-800/50">
                    {progress !== undefined && progress > 0 ? (
                        <div className="mb-2">
                            <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                                <span>Tiến độ học tập</span>
                                <span className="text-indigo-400 font-bold">{progress}%</span>
                            </div>
                            <div className="w-full bg-[#010816] rounded-full h-2 mb-4 overflow-hidden border border-slate-800">
                                <div
                                    className="bg-linear-to-r from-indigo-500 to-purple-500 h-full rounded-full relative shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <Link
                                href={`/courses/${slug}`}
                                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 group/btn"
                            >
                                Tiếp tục học
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href={`/courses/${slug}`}
                            className="w-full py-3 rounded-xl bg-white/5 hover:bg-indigo-600/20 text-white font-bold transition-all border border-white/10 hover:border-indigo-500/50 flex items-center justify-center group/btn backdrop-blur-sm"
                        >
                            Học ngay
                            <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all text-indigo-400" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
