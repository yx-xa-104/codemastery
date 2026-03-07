import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import {
    Users, BookOpen, MessageSquare, Star, TrendingUp,
    ChevronRight, Circle, Video
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

async function fetchAPI(path: string, cookieStore: any) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    try {
        const res = await fetch(`${API_URL}${path}`, {
            headers: { Cookie: cookieStore.toString() },
            cache: 'no-store'
        });
        if (res.ok) return await res.json();
    } catch (e) {
        console.error(`Failed to fetch ${path}`, e);
    }
    return null;
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes}p trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}g trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
}

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const cookieStore = await cookies();

    const [stats, recentCourses, recentStudents] = await Promise.all([
        fetchAPI('/api/admin/dashboard/stats', cookieStore),
        fetchAPI('/api/admin/dashboard/recent-courses', cookieStore),
        fetchAPI('/api/admin/dashboard/recent-students', cookieStore),
    ]);

    const statCards = [
        { label: 'Tổng học viên', value: stats?.studentCount ?? 0, change: `${stats?.enrollCount ?? 0} đăng ký`, icon: Users, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
        { label: 'Khóa học', value: stats?.courseCount ?? 0, change: 'đang hoạt động', icon: BookOpen, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Đánh giá TB', value: stats?.avgRating ?? '0', change: `/ 5.0 (${stats?.reviewCount ?? 0})`, icon: Star, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        { label: 'Lượt đăng ký', value: stats?.enrollCount ?? 0, change: 'tổng cộng', icon: TrendingUp, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    ];

    const courses: any[] = recentCourses ?? [];
    const newStudents: any[] = recentStudents ?? [];

    const levelColors: Record<string, string> = {
        beginner: 'text-green-400 bg-green-500/20 border-green-500/30',
        intermediate: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
        advanced: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    };
    const levelLabels: Record<string, string> = { beginner: 'CĐ', intermediate: 'TB', advanced: 'NC' };

    return (
        <AdminLayout title="Bảng điều khiển Giảng viên" subtitle="Chào mừng trở lại, chúc một ngày dạy học hiệu quả!">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {statCards.map(({ label, value, change, icon: Icon, color }) => (
                    <div key={label} className="bg-[#0B1120] border border-indigo-900/30 rounded-xl p-5 hover:border-indigo-500/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg border ${color}`}><Icon className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs font-medium text-slate-400">{label}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                                    <span className="text-xs text-green-400 flex items-center gap-0.5">
                                        <TrendingUp className="w-3 h-3" /> {change}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left: courses */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-indigo-900/30 flex justify-between items-center">
                            <h3 className="text-base font-semibold text-white flex items-center gap-2">
                                <Video className="w-4 h-4 text-indigo-400" /> Khóa học gần đây
                            </h3>
                            <Link href="/teacher/courses" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Xem tất cả</Link>
                        </div>
                        <div className="divide-y divide-slate-800">
                            {courses.length === 0 ? (
                                <div className="p-8 text-center text-sm text-slate-500">Chưa có khóa học nào</div>
                            ) : courses.map((c: any) => (
                                <div key={c.id} className="p-5 hover:bg-white/5 transition-colors group">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-4">
                                            <div className={`size-11 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${levelColors[c.level] || levelColors.beginner}`}>
                                                {levelLabels[c.level] || c.level?.slice(0, 2)?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">{c.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Circle className={`w-1.5 h-1.5 fill-current ${c.status === 'published' ? 'text-green-500' : 'text-yellow-500'}`} />
                                                        {c.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                                    </span>
                                                    <span>• {c.total_enrollments ?? 0} học viên</span>
                                                    <span>• {timeAgo(c.updated_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Link href={`/teacher/courses`} className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all">Chỉnh sửa</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: new students */}
                <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl overflow-hidden flex flex-col">
                    <div className="px-5 py-4 border-b border-indigo-900/30 flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <h3 className="text-base font-semibold text-white">Đăng ký gần đây</h3>
                    </div>
                    <ul className="divide-y divide-slate-800 p-2 flex-1">
                        {newStudents.length === 0 ? (
                            <li className="p-8 text-center text-sm text-slate-500">Chưa có đăng ký nào</li>
                        ) : newStudents.map((s: any, i: number) => (
                            <li key={i} className="p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0 group-hover:border-amber-500/50 transition-colors">
                                        {s.profiles?.full_name?.split(' ').map((p: string) => p[0]).join('').slice(0, 2) || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{s.profiles?.full_name || 'Ẩn danh'}</p>
                                        <p className="text-xs text-slate-500 truncate">Đăng ký: {s.courses?.title || '–'}</p>
                                    </div>
                                    <div className="text-xs text-slate-500 shrink-0">{timeAgo(s.enrolled_at)}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="p-4 border-t border-slate-800 text-center">
                        <Link href="/admin/students" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                            Xem tất cả học viên →
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
