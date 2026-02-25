import Link from "next/link";
import { Clock, BookOpen, ArrowRight } from "lucide-react";

interface CourseCardProps {
    title: string;
    category: string;
    level: "Cơ bản" | "Trung bình" | "Nâng cao";
    duration: string;
    lessons: number;
    image: string;
    progress?: number;
    slug: string;
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
}: CourseCardProps) {
    return (
        <div className="group glass rounded-2xl overflow-hidden flex flex-col h-full relative border border-white/5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-glow-indigo hover:-translate-y-2">
            {/* "Mới nhất" Badge */}
            {progress === 0 && (
                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    New
                </div>
            )}

            {/* Image Container */}
            <div className="h-52 relative overflow-hidden bg-navy-900 border-b border-white/5">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent"></div>
            </div>

            <div className="p-6 flex flex-col flex-grow relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold tracking-wider text-indigo-300 uppercase bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                        {category}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                        {level}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-indigo-400 transition-colors leading-tight">
                    {title}
                </h3>

                <div className="flex gap-4 text-sm text-slate-400 mb-6 flex-1">
                    <div className="flex items-center gap-1.5 border border-slate-700/50 px-2 py-1 rounded-md bg-navy-950/50">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="font-mono text-xs">{duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 border border-slate-700/50 px-2 py-1 rounded-md bg-navy-950/50">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                        <span className="font-mono text-xs">{lessons} bài</span>
                    </div>
                </div>

                <div className="mt-auto pt-5 border-t border-slate-800/80">
                    {progress !== undefined && progress > 0 ? (
                        <div className="mb-2">
                            <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                                <span>Tiến độ học tập</span>
                                <span className="text-indigo-400 font-bold">{progress}%</span>
                            </div>
                            <div className="w-full bg-navy-950 rounded-full h-2 mb-4 overflow-hidden border border-slate-800">
                                <div
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full relative shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <Link
                                href={`/courses/${slug}`}
                                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-glow-indigo flex items-center justify-center gap-2 group/btn"
                            >
                                Tiếp tục học
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href={`/courses/${slug}`}
                            className="w-full py-3 rounded-xl bg-navy-800 hover:bg-indigo-600/20 text-white font-bold transition-all border border-slate-700 hover:border-indigo-500/50 flex items-center justify-center group/btn"
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
