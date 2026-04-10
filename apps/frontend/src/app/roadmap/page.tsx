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
            <div className="min-h-screen relative z-10">
                {/* Header — clean, no emojis, asymmetric */}
                <header className="relative overflow-hidden border-b border-white/5">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div>
                                <p className="text-sm font-semibold text-zinc-500 tracking-widest uppercase mb-3">Learning Paths</p>
                                <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 tracking-tight">
                                    Lộ trình Học tập
                                </h1>
                                <p className="text-zinc-400 mt-4 max-w-lg leading-relaxed font-light">
                                    Mỗi lộ trình được sắp xếp từ cơ bản đến nâng cao. Hoàn thành theo thứ tự kết hợp thực hành để làm chủ kiến thức nền tảng.
                                </p>
                            </div>

                            {/* Stats pill */}
                            {user && totalCourses > 0 && (
                                <div className="flex items-center gap-5 px-6 py-4 bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl shrink-0 shadow-xl">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-zinc-100">{totalCompleted}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Hoàn thành</p>
                                    </div>
                                    <div className="w-px h-10 bg-white/10" />
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-zinc-100">{totalCourses}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Khóa học</p>
                                    </div>
                                    <div className="w-px h-10 bg-white/10" />
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-zinc-300">{roadmaps.length}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Lộ trình</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Roadmap tracks */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
                    {roadmaps.length === 0 ? (
                        <div className="text-center py-20 bg-zinc-900/20 backdrop-blur-sm rounded-3xl border border-white/5">
                            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-zinc-300 mb-2">Chưa có lộ trình nào</h3>
                            <p className="text-zinc-500 text-sm">Các khóa học chưa được đăng tải lên hệ thống.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {roadmaps.map(roadmap => {
                                const { Icon, accent } = roadmap;
                                const pct = roadmap.avgProgress;

                                return (
                                    <div key={roadmap.slug} className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden transition-all hover:border-white/10 shadow-2xl">
                                        {/* Track header — clean layout */}
                                        <div className="px-6 py-6 sm:px-8 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`size-12 rounded-2xl ${accent.bg} border ${accent.border} flex items-center justify-center`}>
                                                    <Icon className={`w-5 h-5 ${accent.text}`} />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-zinc-100 tracking-tight">{roadmap.title}</h2>
                                                    <p className="text-sm text-zinc-500 mt-1 font-medium">
                                                        {roadmap.totalSteps} khóa học · {roadmap.completedCount} đã hoàn thành
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                {/* Mini progress */}
                                                <div className="w-full md:w-auto flex items-center gap-3">
                                                    <div className="flex-1 md:w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${accent.dot} transition-all duration-1000 ease-in-out`} style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="text-xs text-zinc-400 font-bold w-9 text-right shrink-0">{pct}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Separator */}
                                        <div className="h-px bg-white/5 w-full" />

                                        {/* Course steps — timeline */}
                                        <div className="px-6 py-6 sm:px-8">
                                            <div className="relative">
                                                {/* Timeline line */}
                                                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-white/5" />

                                                <div className="space-y-1">
                                                    {roadmap.steps.map((step, i) => {
                                                        const isNext = !step.done && i === roadmap.steps.findIndex(s => !s.done);
                                                        const tag = levelTag(step.level);

                                                        return (
                                                            <Link
                                                                key={i}
                                                                href={`/courses/${step.courseSlug}`}
                                                                className={`relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pl-12 pr-5 py-4 rounded-2xl transition-all duration-300 group cursor-pointer ${
                                                                    isNext
                                                                        ? 'bg-white/5 hover:bg-white/10'
                                                                        : 'hover:bg-white/[0.02]'
                                                                }`}
                                                            >
                                                                {/* Node dot/icon */}
                                                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 size-8 rounded-full flex items-center justify-center z-10 transition-colors ${
                                                                    step.done
                                                                        ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                                                                        : isNext
                                                                            ? 'bg-zinc-200 border-4 border-[#050505] shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                                                            : 'bg-navy-950 border-2 border-white/10 group-hover:border-white/20'
                                                                }`}>
                                                                    {step.done
                                                                        ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                                        : isNext
                                                                            ? <PlayCircle className="w-4 h-4 text-[#050505] ml-[1px]" />
                                                                            : <span className="text-[10px] font-bold text-zinc-500">{i + 1}</span>
                                                                    }
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                                    <p className={`text-base font-semibold truncate transition-colors duration-300 ${
                                                                        step.done
                                                                            ? 'text-zinc-500 line-through'
                                                                            : isNext
                                                                                ? 'text-zinc-100'
                                                                                : 'text-zinc-400 group-hover:text-zinc-200'
                                                                    }`}>
                                                                        {step.title}
                                                                    </p>
                                                                    <span className={`text-[10px] border rounded px-2 py-0.5 shrink-0 w-fit font-semibold uppercase tracking-wider ${
                                                                        step.done ? 'border-white/5 text-zinc-600' : tag.cls
                                                                    }`}>
                                                                        {tag.label}
                                                                    </span>
                                                                </div>

                                                                {/* Progress or action */}
                                                                <div className="flex items-center gap-4 shrink-0 mt-2 sm:mt-0">
                                                                    {step.enrolled && !step.done && step.progress > 0 && (
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                                                <div className="h-full bg-zinc-400 rounded-full" style={{ width: `${step.progress}%` }} />
                                                                            </div>
                                                                            <span className="text-[10px] text-zinc-500 font-bold">{step.progress}%</span>
                                                                        </div>
                                                                    )}
                                                                    <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${
                                                                        step.done
                                                                            ? 'text-emerald-500/0'
                                                                            : isNext
                                                                                ? 'text-zinc-400 group-hover:translate-x-1'
                                                                                : 'text-zinc-700 group-hover:text-zinc-500 group-hover:translate-x-1 opacity-0 group-hover:opacity-100'
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
