"use client";

import { useState, useEffect } from "react";
import { TeacherLayout } from "@/features/teacher/components/TeacherLayout";
import { createClient } from "@/shared/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, Edit3, BookOpen, Users, Circle, Search, Loader2 } from "lucide-react";

const levelMap: Record<string, string> = {
    beginner: 'Cơ bản',
    intermediate: 'Trung bình',
    advanced: 'Nâng cao',
};

const levelColor: Record<string, string> = {
    beginner: 'text-green-400 bg-green-500/10 border-green-500/20',
    intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    advanced: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const statusLabel: Record<string, string> = {
    draft: 'Bản nháp',
    pending_review: 'Chờ duyệt',
    published: 'Đang hoạt động',
    rejected: 'Bị từ chối',
    suspended: 'Bị đình chỉ'
};

const statusColor: Record<string, string> = {
    draft: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    pending_review: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    published: 'bg-green-500/20 text-green-300 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
    suspended: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function TeacherCoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    useEffect(() => {
        const fetchCourses = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth/login');
                return;
            }

            try {
                const res = await fetch(`${API_URL}/api/courses/my`, {
                    headers: { 'Authorization': `Bearer ${session.access_token}` },
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()));
                }
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [API_URL, router]);

    const filteredCourses = courses.filter(c => {
        const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchLevel = levelFilter ? c.level === levelFilter : true;
        return matchSearch && matchLevel;
    });

    return (
        <TeacherLayout
            title="Quản lý Khóa học"
            subtitle={`${filteredCourses.length} khóa học`}
            action={
                <Link href="/teacher/courses/create" className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-lg transition-all">
                    <Plus className="w-4 h-4" /> Tạo khóa học mới
                </Link>
            }
        >
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors" 
                        placeholder="Tìm kiếm khóa học..." 
                    />
                </div>
                <select 
                    value={levelFilter}
                    onChange={e => setLevelFilter(e.target.value)}
                    className="bg-navy-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Tất cả cấp độ</option>
                    <option value="beginner">Cơ bản</option>
                    <option value="intermediate">Trung bình</option>
                    <option value="advanced">Nâng cao</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                     <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredCourses.map((course: any) => {
                        const category = (course.categories as unknown as { name: string } | null)?.name ?? '';
                        return (
                            <div key={course.id} className="flex flex-col bg-navy-900 border border-indigo-900/30 rounded-xl overflow-hidden hover:border-indigo-500/40 transition-all group">
                                <div className="h-40 bg-[#050C1F] relative overflow-hidden shrink-0">
                                    {course.thumbnail_url
                                        ? <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                                        : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-10 h-10 text-slate-700" /></div>
                                    }
                                    <div className="absolute top-3 right-3">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border ${statusColor[course.status] || statusColor.draft}`}>
                                            <Circle className="w-1.5 h-1.5 fill-current" />
                                            {statusLabel[course.status] || course.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {category && <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{category}</span>}
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${levelColor[course.level] ?? 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                                            {levelMap[course.level] ?? course.level}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-white text-sm line-clamp-2 mb-2 group-hover:text-indigo-300 transition-colors flex-1">{course.title}</h3>
                                    
                                    {course.status === 'rejected' && course.rejection_reason && (
                                        <p className="text-xs text-red-400 line-clamp-2 mb-3 px-2 py-1.5 bg-red-500/10 rounded border border-red-500/20">
                                            <span className="font-bold">Lý do từ chối:</span> {course.rejection_reason}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 mt-auto">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {(course.total_enrollments ?? 0).toLocaleString()}</span>
                                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.total_lessons ?? 0} bài</span>
                                        {course.avg_rating > 0 && <span className="flex items-center gap-1">⭐ {course.avg_rating}</span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/courses/${course.slug}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-all">
                                            <Eye className="w-3.5 h-3.5" /> Xem
                                        </Link>
                                        <Link href={`/teacher/courses/create?id=${course.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all">
                                            <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20">
                    <BookOpen className="w-14 h-14 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400 mb-5">
                        {courses.length === 0 ? "Chưa có khóa học nào" : "Không tìm thấy khóa học phù hợp"}
                    </p>
                    {courses.length === 0 && (
                        <Link href="/teacher/courses/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-lg transition-all">
                            <Plus className="w-4 h-4" /> Tạo khóa học đầu tiên
                        </Link>
                    )}
                </div>
            )}
        </TeacherLayout>
    );
}
