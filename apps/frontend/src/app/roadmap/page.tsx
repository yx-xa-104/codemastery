import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { createClient } from "@/shared/lib/supabase/server";
import Link from "next/link";
import { CheckCircle2, Lock, ChevronRight, Compass } from "lucide-react";

interface RoadmapDef {
    slug: string;
    title: string;
    desc: string;
    color: string;
    badge: string;
    categorySlug: string;
}

const ROADMAP_DEFS: RoadmapDef[] = [
    { slug: "frontend", title: "Frontend Web Development", desc: "Từ HTML cơ bản đến React/Next.js chuyên nghiệp", color: "from-blue-600 to-indigo-600", badge: "🌐", categorySlug: "frontend" },
    { slug: "python", title: "Python & Data Science", desc: "Lập trình Python từ cơ bản đến phân tích dữ liệu", color: "from-yellow-500 to-amber-600", badge: "🐍", categorySlug: "python" },
    { slug: "backend", title: "Backend Development", desc: "Xây dựng API và server với Node.js", color: "from-green-600 to-emerald-600", badge: "⚙️", categorySlug: "backend" },
];

async function getCoursesByCategory() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    try {
        const res = await fetch(`${API_URL}/api/courses`, { cache: 'no-store' });
        if (res.ok) return await res.json();
    } catch (e) {
        console.error("Failed to fetch courses for roadmap", e);
    }
    return [];
}

async function getUserEnrollments(supabase: any) {
    const { data } = await supabase
        .from('enrollments')
        .select('course_id, progress_percent, status');
    return data ?? [];
}

export default async function RoadmapPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const allCourses: any[] = await getCoursesByCategory();
    const enrollments: any[] = user ? await getUserEnrollments(supabase) : [];

    const enrollmentMap = new Map<string, { progress: number; status: string }>();
    enrollments.forEach((e: any) => {
        enrollmentMap.set(e.course_id, { progress: e.progress_percent ?? 0, status: e.status });
    });

    // Group courses by category
    const roadmaps = ROADMAP_DEFS.map(def => {
        const categoryCourses = allCourses.filter((c: any) => {
            const catName = c.categories?.slug || c.categories?.name?.toLowerCase() || '';
            return catName.includes(def.categorySlug);
        });

        const steps = categoryCourses.length > 0
            ? categoryCourses.map((c: any) => {
                const enrollment = enrollmentMap.get(c.id);
                return {
                    title: c.title,
                    courseSlug: c.slug,
                    done: enrollment?.status === 'completed' || (enrollment?.progress ?? 0) >= 100,
                    progress: enrollment?.progress ?? 0,
                    enrolled: !!enrollment,
                };
            })
            : def.slug === 'frontend'
                ? [
                    { title: 'HTML & CSS Cơ bản', courseSlug: null, done: false, progress: 0, enrolled: false },
                    { title: 'JavaScript Cơ bản', courseSlug: null, done: false, progress: 0, enrolled: false },
                    { title: 'Responsive Design', courseSlug: null, done: false, progress: 0, enrolled: false },
                    { title: 'React.js', courseSlug: null, done: false, progress: 0, enrolled: false },
                    { title: 'Next.js & SSR', courseSlug: null, done: false, progress: 0, enrolled: false },
                ]
                : def.slug === 'python'
                    ? [
                        { title: 'Python Cơ bản', courseSlug: null, done: false, progress: 0, enrolled: false },
                        { title: 'OOP trong Python', courseSlug: null, done: false, progress: 0, enrolled: false },
                        { title: 'NumPy & Pandas', courseSlug: null, done: false, progress: 0, enrolled: false },
                        { title: 'Data Visualization', courseSlug: null, done: false, progress: 0, enrolled: false },
                    ]
                    : [
                        { title: 'Node.js Cơ bản', courseSlug: null, done: false, progress: 0, enrolled: false },
                        { title: 'RESTful API', courseSlug: null, done: false, progress: 0, enrolled: false },
                        { title: 'Database & SQL', courseSlug: null, done: false, progress: 0, enrolled: false },
                        { title: 'Docker & Deployment', courseSlug: null, done: false, progress: 0, enrolled: false },
                    ];

        const completedCount = steps.filter(s => s.done).length;
        const totalSteps = steps.length;

        return { ...def, steps, completedCount, totalSteps };
    });

    return (
        <MainLayout>
            <div className="min-h-screen bg-[#010816]">
                <div className="text-center py-16 px-4 border-b border-indigo-900/30 bg-[#010816]">
                    <div className="inline-block text-3xl mb-4">🗺️</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Lộ trình <span className="text-indigo-400">Học tập</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Chọn con đường phù hợp với mục tiêu của bạn và học theo từng bước có hướng dẫn
                    </p>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
                    {roadmaps.map(roadmap => (
                        <div key={roadmap.slug} className="bg-[#0B1120] border border-indigo-900/30 rounded-2xl overflow-hidden">
                            {/* Header */}
                            <div className={`bg-linear-to-r ${roadmap.color} p-6`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{roadmap.badge}</span>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">{roadmap.title}</h2>
                                            <p className="text-white/70 text-sm mt-0.5">{roadmap.desc}</p>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-white/90 font-bold text-sm">{roadmap.completedCount}/{roadmap.totalSteps}</p>
                                        <p className="text-white/50 text-xs">hoàn thành</p>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                {roadmap.totalSteps > 0 && (
                                    <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white/80 rounded-full transition-all"
                                            style={{ width: `${(roadmap.completedCount / roadmap.totalSteps) * 100}%` }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Steps */}
                            <div className="p-6">
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-indigo-900/50" />
                                    <div className="space-y-5">
                                        {roadmap.steps.map((step, i) => {
                                            const isNext = !step.done && i === roadmap.steps.findIndex(s => !s.done);
                                            return (
                                                <div key={i} className="flex items-center gap-4 relative pl-12">
                                                    <div className={`absolute left-0 size-9 rounded-full flex items-center justify-center shrink-0 z-10 ${step.done
                                                        ? 'bg-green-500/20 border border-green-500/50'
                                                        : isNext
                                                            ? 'bg-indigo-500/20 border border-indigo-500/50'
                                                            : 'bg-[#010816] border border-slate-700'
                                                        }`}>
                                                        {step.done
                                                            ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                            : isNext
                                                                ? <span className="text-xs font-bold text-indigo-400">{i + 1}</span>
                                                                : <Lock className="w-3.5 h-3.5 text-slate-600" />
                                                        }
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-between">
                                                        <div>
                                                            <p className={`text-sm font-medium ${step.done ? 'text-green-300 line-through opacity-70' : 'text-white'}`}>
                                                                {step.title}
                                                            </p>
                                                            {step.enrolled && !step.done && step.progress > 0 && (
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <div className="w-20 h-1 bg-slate-700 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${step.progress}%` }} />
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-400">{step.progress}%</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Link
                                                            href={step.courseSlug ? `/courses/${step.courseSlug}` : '/courses'}
                                                            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all shrink-0 ml-3 ${step.done
                                                                ? 'text-slate-500 bg-slate-800/50 cursor-default'
                                                                : 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20'
                                                                }`}
                                                        >
                                                            {step.done ? 'Hoàn thành' : step.enrolled ? 'Tiếp tục' : 'Bắt đầu'}
                                                            {!step.done && <ChevronRight className="w-3 h-3" />}
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
