import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { createClient } from "@/shared/lib/supabase/server";
import Link from "next/link";
import {
    CheckCircle2, Lock, ChevronRight, PlayCircle, BookOpen,
    Globe, Database, Smartphone, Cloud, BrainCircuit, BarChart3, ArrowRight
} from "lucide-react";

// SVG icon mapping per category — NO emojis
const CATEGORY_ICONS: Record<string, React.ElementType> = {
    "lap-trinh-web": Globe,
    "data-science": BarChart3,
    "ai-machine-learning": BrainCircuit,
    "mobile-app": Smartphone,
    "devops": Cloud,
    "database": Database,
};

// Subtle accent colors per category — muted, not rainbow gradients
const CATEGORY_ACCENT: Record<string, { border: string; text: string; bg: string; dot: string }> = {
    "lap-trinh-web": { border: "border-blue-500/30", text: "text-blue-400", bg: "bg-blue-500/10", dot: "bg-blue-500" },
    "data-science": { border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/10", dot: "bg-amber-500" },
    "ai-machine-learning": { border: "border-fuchsia-500/30", text: "text-fuchsia-400", bg: "bg-fuchsia-500/10", dot: "bg-fuchsia-500" },
    "mobile-app": { border: "border-emerald-500/30", text: "text-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-500" },
    "devops": { border: "border-cyan-500/30", text: "text-cyan-400", bg: "bg-cyan-500/10", dot: "bg-cyan-500" },
    "database": { border: "border-orange-500/30", text: "text-orange-400", bg: "bg-orange-500/10", dot: "bg-orange-500" },
};

const DEFAULT_ACCENT = { border: "border-indigo-500/30", text: "text-indigo-400", bg: "bg-indigo-500/10", dot: "bg-indigo-500" };

interface Category { name: string; slug: string; sort_order: number; }
interface Course { id: string; title: string; slug: string; level: string; categories: { name: string; slug: string } | null; }

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const LEVEL_ORDER: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };

export default async function RoadmapPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: { session } } = await supabase.auth.getSession();

    const authHeaders: Record<string, string> = {};
    if (session?.access_token) authHeaders['Authorization'] = `Bearer ${session.access_token}`;

    let categories: Category[] = [];
    let allCourses: Course[] = [];
    type EnrollRow = { course_id: string; progress_percent: number | null; status: string };
    let enrollments: EnrollRow[] = [];

    try {
        const [resCat, resCourses] = await Promise.all([
            fetch(`${API_URL}/api/courses/categories`, { cache: 'no-store' }),
            fetch(`${API_URL}/api/courses?status=published`, { cache: 'no-store' }),
        ]);
        if (resCat.ok) categories = await resCat.json();
        if (resCourses.ok) allCourses = await resCourses.json();
    } catch { /* fallback empty */ }

    if (user) {
        try {
            const res = await fetch(`${API_URL}/api/enrollments`, { headers: authHeaders, cache: 'no-store' });
            if (res.ok) enrollments = await res.json();
        } catch { /* */ }
    }

    const enrollMap = new Map<string, { progress: number; status: string }>();
    enrollments.forEach(e => enrollMap.set(e.course_id, { progress: e.progress_percent ?? 0, status: e.status }));

    const roadmaps = categories
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(cat => {
            const accent = CATEGORY_ACCENT[cat.slug] ?? DEFAULT_ACCENT;
            const Icon = CATEGORY_ICONS[cat.slug] ?? BookOpen;
            const courses = allCourses
                .filter(c => c.categories?.slug === cat.slug || c.categories?.name === cat.name)
                .sort((a, b) => (LEVEL_ORDER[a.level] ?? 1) - (LEVEL_ORDER[b.level] ?? 1));

            const steps = courses.map(c => {
                const e = enrollMap.get(c.id);
                return {
                    title: c.title,
                    courseSlug: c.slug,
                    level: c.level,
                    done: e?.status === 'completed' || (e?.progress ?? 0) >= 100,
                    progress: e?.progress ?? 0,
                    enrolled: !!e,
                };
            });

            const avgProgress = steps.length > 0
                ? Math.round(steps.reduce((sum, s) => sum + s.progress, 0) / steps.length)
                : 0;

            return { slug: cat.slug, title: cat.name, Icon, accent, steps, completedCount: steps.filter(s => s.done).length, totalSteps: steps.length, avgProgress };
        })
        .filter(r => r.totalSteps > 0);

    const levelTag = (l: string) => {
        const map: Record<string, { label: string; cls: string }> = {
            beginner: { label: 'Cơ bản', cls: 'text-emerald-400/80 border-emerald-500/20' },
            intermediate: { label: 'Trung cấp', cls: 'text-amber-400/80 border-amber-500/20' },
            advanced: { label: 'Nâng cao', cls: 'text-red-400/80 border-red-500/20' },
        };
        return map[l] ?? { label: l, cls: 'text-slate-400 border-slate-600' };
    };

    // Overall stats
    const totalCourses = roadmaps.reduce((s, r) => s + r.totalSteps, 0);
    const totalCompleted = roadmaps.reduce((s, r) => s + r.completedCount, 0);

    return (
        <MainLayout>
            <div className="min-h-screen bg-[#010816]">
                {/* Header — clean, no emojis, asymmetric */}
                <header className="relative overflow-hidden border-b border-slate-800/50">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div>
                                <p className="text-sm font-medium text-indigo-400 tracking-wide uppercase mb-3">Learning Paths</p>
                                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                    Lộ trình Học tập
                                </h1>
                                <p className="text-slate-400 mt-3 max-w-lg leading-relaxed">
                                    Mỗi lộ trình được sắp xếp từ cơ bản đến nâng cao. Hoàn thành theo thứ tự để nắm vững kiến thức.
                                </p>
                            </div>

                            {/* Stats pill */}
                            {user && totalCourses > 0 && (
                                <div className="flex items-center gap-4 px-5 py-3 bg-[#0B1120] border border-slate-800 rounded-xl shrink-0">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white">{totalCompleted}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Hoàn thành</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-800" />
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white">{totalCourses}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Khóa học</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-800" />
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-indigo-400">{roadmaps.length}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Lộ trình</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Roadmap tracks */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                    {roadmaps.length === 0 ? (
                        <div className="text-center py-20">
                            <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Chưa có lộ trình nào</h3>
                            <p className="text-slate-500 text-sm">Các khóa học chưa được đăng tải.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {roadmaps.map(roadmap => {
                                const { Icon, accent } = roadmap;
                                const pct = roadmap.avgProgress;

                                return (
                                    <div key={roadmap.slug} className={`bg-[#0B1120] border ${accent.border} rounded-2xl overflow-hidden transition-colors hover:border-opacity-60`}>
                                        {/* Track header — no heavy gradient, clean layout */}
                                        <div className="px-6 py-5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`size-11 rounded-xl ${accent.bg} flex items-center justify-center`}>
                                                    <Icon className={`w-5 h-5 ${accent.text}`} />
                                                </div>
                                                <div>
                                                    <h2 className="text-base font-bold text-white">{roadmap.title}</h2>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {roadmap.totalSteps} khóa học · {roadmap.completedCount} đã xong
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {/* Mini progress */}
                                                <div className="hidden sm:flex items-center gap-2">
                                                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${accent.dot}`} style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-mono w-8">{pct}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Separator */}
                                        <div className="mx-6 border-t border-slate-800/60" />

                                        {/* Course steps — timeline */}
                                        <div className="px-6 py-5">
                                            <div className="relative">
                                                {/* Timeline line */}
                                                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-800" />

                                                <div className="space-y-1">
                                                    {roadmap.steps.map((step, i) => {
                                                        const isNext = !step.done && i === roadmap.steps.findIndex(s => !s.done);
                                                        const tag = levelTag(step.level);

                                                        return (
                                                            <Link
                                                                key={i}
                                                                href={`/courses/${step.courseSlug}`}
                                                                className={`relative flex items-center gap-4 pl-10 pr-4 py-3 rounded-xl transition-all group cursor-pointer ${
                                                                    isNext
                                                                        ? 'bg-indigo-500/5 hover:bg-indigo-500/10'
                                                                        : 'hover:bg-white/[0.02]'
                                                                }`}
                                                            >
                                                                {/* Node dot/icon */}
                                                                <div className={`absolute left-0 size-[30px] rounded-full flex items-center justify-center z-10 ${
                                                                    step.done
                                                                        ? 'bg-emerald-500/15 border border-emerald-500/40'
                                                                        : isNext
                                                                            ? 'bg-indigo-500/15 border-2 border-indigo-500/50'
                                                                            : 'bg-[#0B1120] border border-slate-700/80'
                                                                }`}>
                                                                    {step.done
                                                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                                        : isNext
                                                                            ? <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
                                                                            : <span className="text-[10px] font-bold text-slate-600">{i + 1}</span>
                                                                    }
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex-1 min-w-0 flex items-center gap-3">
                                                                    <p className={`text-sm font-medium truncate ${
                                                                        step.done
                                                                            ? 'text-slate-500 line-through'
                                                                            : isNext
                                                                                ? 'text-white'
                                                                                : 'text-slate-300'
                                                                    }`}>
                                                                        {step.title}
                                                                    </p>
                                                                    <span className={`text-[10px] border rounded px-1.5 py-px shrink-0 ${tag.cls}`}>
                                                                        {tag.label}
                                                                    </span>
                                                                </div>

                                                                {/* Progress or action */}
                                                                <div className="flex items-center gap-3 shrink-0">
                                                                    {step.enrolled && !step.done && step.progress > 0 && (
                                                                        <div className="hidden sm:flex items-center gap-1.5">
                                                                            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${step.progress}%` }} />
                                                                            </div>
                                                                            <span className="text-[10px] text-slate-500 font-mono">{step.progress}%</span>
                                                                        </div>
                                                                    )}
                                                                    <ArrowRight className={`w-4 h-4 transition-all ${
                                                                        step.done
                                                                            ? 'text-emerald-500/40'
                                                                            : isNext
                                                                                ? 'text-indigo-400 group-hover:translate-x-0.5'
                                                                                : 'text-slate-700 group-hover:text-slate-500'
                                                                    }`} />
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
