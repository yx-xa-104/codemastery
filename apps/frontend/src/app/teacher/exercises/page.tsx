"use client";

import { TeacherLayout } from "@/features/teacher/components/TeacherLayout";
import { useState, useEffect } from "react";
import { Plus, Code, CheckCircle, FileText, Search, Edit3, Trash2, Clock, Loader2, BookOpen } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const diffColor: Record<string, string> = {
    'easy': 'text-green-400 bg-green-500/10 border-green-500/20',
    'medium': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'hard': 'text-red-400 bg-red-500/10 border-red-500/20',
};

const diffLabel: Record<string, string> = {
    'easy': 'Cơ bản',
    'medium': 'Trung bình',
    'hard': 'Nâng cao',
};

export default function TeacherExercisesPage() {
    const router = useRouter();
    const [exercises, setExercises] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const fetchExercises = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/practice`);
            if (res.ok) {
                const data = await res.json();
                setExercises(data);
            }
        } catch (error) {
            console.error("Failed to load exercises:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExercises();
    }, [API_URL]);

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa bài tập "${title}"?`)) return;

        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            alert("Vui lòng đăng nhập lại!");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/practice/${id}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (res.ok) {
                setExercises(prev => prev.filter(e => e.id !== id));
            } else {
                alert("Xóa thất bại!");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Đã xảy ra lỗi khi xóa.");
        }
    };

    // Derived unique categories
    const categories = Array.from(new Set(exercises.map(ex => ex.category || 'Khác'))).filter(Boolean).sort();

    const filtered = exercises.filter(ex => {
        const cat = ex.category || 'Khác';
        return (!activeCategory || cat === activeCategory) &&
            (!search || ex.title.toLowerCase().includes(search.toLowerCase()) || ex.language?.toLowerCase().includes(search.toLowerCase()));
    });

    return (
        <TeacherLayout
            title="Ngân hàng Bài tập"
            subtitle={`${exercises.length} bài tập`}
            action={
                <Link href="/teacher/exercises/create" className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-lg transition-all">
                    <Plus className="w-4 h-4" /> Thêm bài tập
                </Link>
            }
        >
            <div className="flex flex-wrap gap-2 mb-5">
                <button onClick={() => setActiveCategory(null)} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${!activeCategory ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' : 'text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}>
                    Tất cả ({exercises.length})
                </button>
                {categories.map((cat) => (
                    <button key={cat as string} onClick={() => setActiveCategory(activeCategory === cat ? null : cat as string)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${activeCategory === cat ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' : 'text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}>
                        {cat as string} ({exercises.filter(e => (e.category || 'Khác') === cat).length})
                    </button>
                ))}
            </div>

            <div className="relative mb-5 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0B1120] border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="Tìm bài tập, ngôn ngữ..." />
            </div>

            <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl overflow-hidden min-h-[300px]">
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    <div className="divide-y divide-indigo-900/20">
                        {filtered.map(ex => (
                            <div key={ex.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors group">
                                <div className="p-2 rounded-lg border text-indigo-400 bg-indigo-500/10 border-indigo-500/20">
                                    <Code className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors truncate">{ex.title}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-mono">
                                        <span className="text-emerald-400">{ex.language}</span>
                                        <span>•</span>
                                        <span>{ex.total_submissions?.toLocaleString() || 0} lượt nộp</span>
                                        <span>•</span>
                                        <span className="text-green-500">{ex.total_accepted?.toLocaleString() || 0} accepted</span>
                                        {ex.created_at && (
                                            <>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 font-sans"><Clock className="w-3 h-3" /> {new Date(ex.created_at).toLocaleDateString('vi-VN')}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded border shrink-0 ${diffColor[ex.difficulty || 'easy'] ?? ''}`}>{diffLabel[ex.difficulty || 'easy'] || ex.difficulty}</span>
                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                                    <Link href={`/teacher/exercises/create?id=${ex.id}`} className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors rounded block">
                                        <Edit3 className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => handleDelete(ex.id, ex.title)} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-slate-500">
                                <FileText className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                                Không tìm thấy bài tập nào. Tạo bài tập mới ở góc trên bên phải.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
