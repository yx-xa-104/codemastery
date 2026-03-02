"use client";

import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useState } from "react";
import { Plus, Code, CheckCircle, FileText, Search, Edit3, Trash2, Clock } from "lucide-react";

const EXERCISE_TYPES = [
    { id: 'interactive', label: 'Code thực hành', icon: Code, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { id: 'quiz', label: 'Trắc nghiệm', icon: CheckCircle, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    { id: 'theory', label: 'Lý thuyết', icon: FileText, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
];

const MOCK_EXERCISES = [
    { id: 1, title: 'Hello World trong Python', type: 'interactive', course: 'Python Cơ bản', difficulty: 'Cơ bản', updatedAt: '2 ngày trước', submissions: 234 },
    { id: 2, title: 'Tìm số nguyên tố', type: 'interactive', course: 'Python Cơ bản', difficulty: 'Trung bình', updatedAt: '5 ngày trước', submissions: 189 },
    { id: 3, title: 'CSS Flexbox Layout', type: 'interactive', course: 'HTML Frontend', difficulty: 'Cơ bản', updatedAt: '1 tuần trước', submissions: 412 },
    { id: 4, title: 'Kiến thức JavaScript cơ bản', type: 'quiz', course: 'JavaScript Nâng cao', difficulty: 'Cơ bản', updatedAt: '3 ngày trước', submissions: 87 },
    { id: 5, title: 'Giới thiệu về Python', type: 'theory', course: 'Python Cơ bản', difficulty: 'Cơ bản', updatedAt: '2 tuần trước', submissions: 320 },
    { id: 6, title: 'Arrow Functions & Closures', type: 'interactive', course: 'JavaScript Nâng cao', difficulty: 'Nâng cao', updatedAt: '4 ngày trước', submissions: 148 },
];

const diffColor: Record<string, string> = {
    'Cơ bản': 'text-green-400 bg-green-500/10 border-green-500/20',
    'Trung bình': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'Nâng cao': 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function AdminExercisesPage() {
    const [activeType, setActiveType] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const filtered = MOCK_EXERCISES.filter(ex =>
        (!activeType || ex.type === activeType) &&
        (!search || ex.title.toLowerCase().includes(search.toLowerCase()) || ex.course.toLowerCase().includes(search.toLowerCase()))
    );

    const typeIcon = (type: string) => {
        const t = EXERCISE_TYPES.find(t => t.id === type);
        if (!t) return null;
        const Icon = t.icon;
        return <div className={`p-2 rounded-lg border ${t.color}`}><Icon className="w-4 h-4" /></div>;
    };

    return (
        <AdminLayout
            title="Ngân hàng Bài tập"
            subtitle={`${MOCK_EXERCISES.length} bài tập`}
            action={
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-lg transition-all">
                    <Plus className="w-4 h-4" /> Thêm bài tập
                </button>
            }
        >
            {/* Type filter chips */}
            <div className="flex flex-wrap gap-2 mb-5">
                <button onClick={() => setActiveType(null)} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${!activeType ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' : 'text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}>
                    Tất cả ({MOCK_EXERCISES.length})
                </button>
                {EXERCISE_TYPES.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setActiveType(activeType === id ? null : id)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${activeType === id ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' : 'text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {label} ({MOCK_EXERCISES.filter(e => e.type === id).length})
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative mb-5 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0B1120] border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="Tìm bài tập, khóa học..."
                />
            </div>

            {/* Exercise list */}
            <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl overflow-hidden">
                <div className="divide-y divide-indigo-900/20">
                    {filtered.map(ex => (
                        <div key={ex.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors group">
                            {typeIcon(ex.type)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors truncate">{ex.title}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                    <span>{ex.course}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ex.updatedAt}</span>
                                    <span>•</span>
                                    <span>{ex.submissions.toLocaleString()} lượt nộp</span>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded border shrink-0 ${diffColor[ex.difficulty] ?? ''}`}>{ex.difficulty}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors rounded"><Edit3 className="w-4 h-4" /></button>
                                <button className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-slate-500">
                            <FileText className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                            Không tìm thấy bài tập nào
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
