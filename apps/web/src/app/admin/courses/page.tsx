import { AdminLayout } from "@/components/layouts/AdminLayout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, Edit3, BookOpen, Users, Circle, Search } from "lucide-react";

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

export default async function AdminCoursesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: courses } = await (supabase as any)
        .from('courses')
        .select('id, title, slug, level, status, thumbnail_url, total_enrollments, avg_rating, total_lessons, categories(name)')
        .order('created_at', { ascending: false });

    return (
        <AdminLayout
            title="Quản lý Khóa học"
            subtitle={`${courses?.length ?? 0} khóa học`}
            action={
                <Link href="/admin/courses/create" className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-lg transition-all">
                    <Plus className="w-4 h-4" /> Tạo khóa học mới
                </Link>
            }
        >
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0B1120] border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                        placeholder="Tìm kiếm khóa học..."
                    />
                </div>
                <select className="bg-[#0B1120] border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Tất cả cấp độ</option>
                    <option value="beginner">Cơ bản</option>
                    <option value="intermediate">Trung bình</option>
                    <option value="advanced">Nâng cao</option>
                </select>
                <select className="bg-[#0B1120] border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Tất cả trạng thái</option>
                    <option value="published">Đang hoạt động</option>
                    <option value="draft">Bản nháp</option>
                </select>
            </div>

            {/* Courses grid */}
            {courses && courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {courses.map((course: any) => {
                        const category = (course.categories as unknown as { name: string } | null)?.name ?? '';
                        return (
                            <div key={course.id} className="bg-[#0B1120] border border-indigo-900/30 rounded-xl overflow-hidden hover:border-indigo-500/40 transition-all group">
                                {/* Thumbnail */}
                                <div className="h-40 bg-[#050C1F] relative overflow-hidden">
                                    {course.thumbnail_url
                                        ? <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                                        : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-10 h-10 text-slate-700" /></div>
                                    }
                                    {/* Status badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border ${course.status === 'published' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}`}>
                                            <Circle className="w-1.5 h-1.5 fill-current" />
                                            {course.status === 'published' ? 'Đang hoạt động' : 'Bản nháp'}
                                        </span>
                                    </div>
                                </div>
                                {/* Info */}
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        {category && <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{category}</span>}
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${levelColor[course.level] ?? 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                                            {levelMap[course.level] ?? course.level}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-white text-sm line-clamp-2 mb-3 group-hover:text-indigo-300 transition-colors">{course.title}</h3>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {(course.total_enrollments ?? 0).toLocaleString()}</span>
                                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.total_lessons ?? 0} bài</span>
                                        {course.avg_rating && <span className="flex items-center gap-1">⭐ {course.avg_rating}</span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/courses/${course.slug}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-all">
                                            <Eye className="w-3.5 h-3.5" /> Xem
                                        </Link>
                                        <Link href={`/admin/courses/create`} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all">
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
                    <p className="text-slate-400 mb-5">Chưa có khóa học nào</p>
                    <Link href="/admin/courses/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-lg transition-all">
                        <Plus className="w-4 h-4" /> Tạo khóa học đầu tiên
                    </Link>
                </div>
            )}
        </AdminLayout>
    );
}
