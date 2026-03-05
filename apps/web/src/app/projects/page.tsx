import { MainLayout } from "@/components/layouts/MainLayout";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Code2, ExternalLink, Star, Users, Folder } from "lucide-react";

const MOCK_PROJECTS = [
    {
        title: "Todo App với React",
        desc: "Xây dựng ứng dụng quản lý công việc với React hooks và localStorage",
        tags: ["React", "JavaScript", "CSS"],
        difficulty: "Cơ bản",
        stars: 45,
        forks: 12,
        color: "from-blue-600/20 to-indigo-600/20 border-blue-500/30",
    },
    {
        title: "REST API với Node.js",
        desc: "Tạo một RESTful API hoàn chỉnh với Express, JWT Authentication và PostgreSQL",
        tags: ["Node.js", "Express", "SQL"],
        difficulty: "Trung bình",
        stars: 78,
        forks: 24,
        color: "from-green-600/20 to-emerald-600/20 border-green-500/30",
    },
    {
        title: "Portfolio Website",
        desc: "Thiết kế và triển khai trang portfolio cá nhân với Next.js và Tailwind CSS",
        tags: ["Next.js", "TypeScript", "Tailwind"],
        difficulty: "Cơ bản",
        stars: 92,
        forks: 38,
        color: "from-purple-600/20 to-pink-600/20 border-purple-500/30",
    },
    {
        title: "Chat App Real-time",
        desc: "Ứng dụng nhắn tin thời gian thực với Socket.io, React và Node.js",
        tags: ["Socket.io", "React", "Node.js"],
        difficulty: "Nâng cao",
        stars: 134,
        forks: 56,
        color: "from-amber-600/20 to-orange-600/20 border-amber-500/30",
    },
    {
        title: "Machine Learning Classifier",
        desc: "Xây dựng mô hình phân loại hình ảnh sử dụng Python và scikit-learn",
        tags: ["Python", "ML", "scikit-learn"],
        difficulty: "Nâng cao",
        stars: 67,
        forks: 19,
        color: "from-yellow-600/20 to-amber-600/20 border-yellow-500/30",
    },
    {
        title: "E-commerce Dashboard",
        desc: "Dashboard quản trị thương mại điện tử với biểu đồ và phân tích dữ liệu",
        tags: ["React", "Chart.js", "TypeScript"],
        difficulty: "Trung bình",
        stars: 89,
        forks: 31,
        color: "from-red-600/20 to-rose-600/20 border-red-500/30",
    },
];

const DIFF_COLOR: Record<string, string> = {
    'Cơ bản': 'text-green-400 bg-green-500/10 border-green-500/20',
    'Trung bình': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'Nâng cao': 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default async function ProjectsPage() {
    return (
        <MainLayout>
            <div className="min-h-screen bg-[#010816]">
                {/* Hero */}
                <div className="text-center py-16 px-4 border-b border-indigo-900/30">
                    <Folder className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Dự án <span className="text-amber-400">Thực hành</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Áp dụng kiến thức vào các dự án thực tế, xây dựng portfolio ấn tượng
                    </p>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                    {/* Filter */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {['Tất cả', 'Cơ bản', 'Trung bình', 'Nâng cao', 'Frontend', 'Backend', 'Full Stack'].map((tag, i) => (
                            <button key={tag} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${i === 0 ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' : 'text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}>
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Project grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {MOCK_PROJECTS.map(project => (
                            <div key={project.title} className={`bg-linear-to-br ${project.color} border rounded-xl p-5 hover:-translate-y-0.5 transition-all duration-200 group`}>
                                <div className="flex items-start justify-between mb-3">
                                    <Code2 className="w-8 h-8 text-indigo-400 opacity-70" />
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${DIFF_COLOR[project.difficulty]}`}>{project.difficulty}</span>
                                </div>
                                <h3 className="font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{project.title}</h3>
                                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{project.desc}</p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-800/80 text-slate-400 rounded border border-slate-700">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Star className="w-3 h-3" />{project.stars}</span>
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{project.forks}</span>
                                    </div>
                                    <Link href="/courses" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-white transition-colors">
                                        Xem chi tiết <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
