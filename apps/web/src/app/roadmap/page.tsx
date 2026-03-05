import { MainLayout } from "@/components/layouts/MainLayout";
import Link from "next/link";
import { CheckCircle2, Lock, ChevronRight } from "lucide-react";

const ROADMAPS = [
    {
        slug: "frontend",
        title: "Frontend Web Development",
        desc: "Từ HTML cơ bản đến React/Next.js chuyên nghiệp",
        color: "from-blue-600 to-indigo-600",
        badge: "🌐",
        steps: [
            { title: "HTML & CSS Cơ bản", done: true, courseSlug: null },
            { title: "JavaScript Cơ bản", done: true, courseSlug: null },
            { title: "Responsive Design", done: false, courseSlug: null },
            { title: "React.js", done: false, courseSlug: null },
            { title: "Next.js & SSR", done: false, courseSlug: null },
            { title: "TypeScript", done: false, courseSlug: null },
        ]
    },
    {
        slug: "python",
        title: "Python & Data Science",
        desc: "Lập trình Python từ cơ bản đến phân tích dữ liệu",
        color: "from-yellow-500 to-amber-600",
        badge: "🐍",
        steps: [
            { title: "Python Cơ bản", done: false, courseSlug: null },
            { title: "OOP trong Python", done: false, courseSlug: null },
            { title: "NumPy & Pandas", done: false, courseSlug: null },
            { title: "Data Visualization", done: false, courseSlug: null },
            { title: "Machine Learning cơ bản", done: false, courseSlug: null },
        ]
    },
    {
        slug: "backend",
        title: "Backend Development",
        desc: "Xây dựng API và server với Node.js",
        color: "from-green-600 to-emerald-600",
        badge: "⚙️",
        steps: [
            { title: "Node.js Cơ bản", done: false, courseSlug: null },
            { title: "RESTful API", done: false, courseSlug: null },
            { title: "Database & SQL", done: false, courseSlug: null },
            { title: "Authentication & JWT", done: false, courseSlug: null },
            { title: "Docker & Deployment", done: false, courseSlug: null },
        ]
    },
];

export default function RoadmapPage() {
    return (
        <MainLayout>
            <div className="min-h-screen bg-[#010816]">
                {/* Hero */}
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
                    {ROADMAPS.map(roadmap => (
                        <div key={roadmap.slug} className="bg-[#0B1120] border border-indigo-900/30 rounded-2xl overflow-hidden">
                            {/* Header */}
                            <div className={`bg-linear-to-r ${roadmap.color} p-6`}>
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{roadmap.badge}</span>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{roadmap.title}</h2>
                                        <p className="text-white/70 text-sm mt-0.5">{roadmap.desc}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="p-6">
                                <div className="relative">
                                    {/* Vertical line */}
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-indigo-900/50" />

                                    <div className="space-y-5">
                                        {roadmap.steps.map((step, i) => (
                                            <div key={i} className="flex items-center gap-4 relative pl-12">
                                                <div className={`absolute left-0 size-9 rounded-full flex items-center justify-center shrink-0 z-10 ${step.done
                                                    ? 'bg-green-500/20 border border-green-500/50'
                                                    : i === roadmap.steps.findIndex(s => !s.done)
                                                        ? 'bg-indigo-500/20 border border-indigo-500/50'
                                                        : 'bg-[#010816] border border-slate-700'
                                                    }`}>
                                                    {step.done
                                                        ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                        : i === roadmap.steps.findIndex(s => !s.done)
                                                            ? <span className="text-xs font-bold text-indigo-400">{i + 1}</span>
                                                            : <Lock className="w-3.5 h-3.5 text-slate-600" />
                                                    }
                                                </div>
                                                <div className="flex-1 flex items-center justify-between">
                                                    <div>
                                                        <p className={`text-sm font-medium ${step.done ? 'text-green-300 line-through opacity-70' : 'text-white'}`}>
                                                            {step.title}
                                                        </p>
                                                    </div>
                                                    <Link href="/courses"
                                                        className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all shrink-0 ml-3 ${step.done
                                                            ? 'text-slate-500 bg-slate-800/50 cursor-default'
                                                            : 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20'
                                                            }`}>
                                                        {step.done ? 'Hoàn thành' : 'Bắt đầu'}
                                                        {!step.done && <ChevronRight className="w-3 h-3" />}
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
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
