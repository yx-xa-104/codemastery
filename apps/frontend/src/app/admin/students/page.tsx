import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, BookOpen, TrendingUp, Search, Mail } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const levelMap: Record<string, string> = {
    beginner: 'Cơ bản',
    intermediate: 'Trung bình',
    advanced: 'Nâng cao',
};

export default async function AdminStudentsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? '';
    const authHeaders = { 'Authorization': `Bearer ${token}` };

    type EnrollRow = {
        id: string;
        progress_percent: number | null;
        enrolled_at: string | null;
        user_id: string;
        courses: { title: string; level: string } | null;
        profiles: { full_name: string | null; student_id: string | null; avatar_url: string | null } | null;
    };

    let enrollments: EnrollRow[] = [];
    let totalStudents = 0;
    let totalEnrollments = 0;

    try {
        const [resEnrollments, resStats] = await Promise.all([
            fetch(`${API_URL}/api/admin/enrollments`, {
                headers: authHeaders,
                cache: 'no-store'
            }),
            fetch(`${API_URL}/api/admin/reports/stats`, {
                headers: authHeaders,
                cache: 'no-store'
            })
        ]);

        if (resEnrollments.ok) {
            enrollments = await resEnrollments.json();
        }
        if (resStats.ok) {
            const stats = await resStats.json();
            totalStudents = stats.totalStudents || 0;
            totalEnrollments = stats.totalEnrollments || 0;
        }
    } catch (err) {
        console.error('Failed to fetch data for students page', err);
    }

    return (
        <AdminLayout
            title="Quản lý Học viên"
            subtitle={`${totalStudents ?? 0} học viên đã đăng ký`}
        >
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { icon: Users, label: 'Tổng học viên', value: totalStudents ?? 0, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                    { icon: BookOpen, label: 'Lượt đăng ký', value: totalEnrollments ?? 0, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                    { icon: TrendingUp, label: 'Học viên mới (tuần)', value: 12, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className={`bg-navy-900 border rounded-xl p-5 flex items-center gap-4 ${color.split(' ').slice(1).join(' ')}`}>
                        <div className={`p-3 rounded-lg border ${color}`}><Icon className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-slate-400">{label}</p>
                            <p className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="flex gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input className="w-full pl-9 pr-4 py-2.5 bg-navy-900 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm" placeholder="Tìm học viên..." />
                </div>
                <select className="bg-navy-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Tất cả khóa học</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-navy-900 border border-indigo-900/30 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-indigo-900/30 bg-[#050C1F]">
                                <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Học viên</th>
                                <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Khóa học</th>
                                <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Cấp độ</th>
                                <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Tiến độ</th>
                                <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Đăng ký</th>
                                <th className="px-5 py-3.5" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-900/20">
                            {enrollments.map(e => {
                                const profile = e.profiles;
                                const course = e.courses;
                                const name = profile?.full_name ?? 'Ẩn danh';
                                const studentId = profile?.student_id ?? '—';
                                const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                                const progress = e.progress_percent ?? 0;
                                const enrollDate = e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString('vi-VN') : '—';

                                return (
                                    <tr key={e.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {profile?.avatar_url ? (
                                                    <img src={profile.avatar_url} className="size-9 rounded-full object-cover border border-slate-700" alt="" />
                                                ) : (
                                                    <div className="size-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">{initials}</div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-white">{name}</p>
                                                    <p className="text-xs text-slate-500">{studentId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-slate-300 truncate max-w-[200px]">{course?.title ?? '—'}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs text-slate-400">{levelMap[course?.level ?? ''] ?? '—'}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 w-32">
                                                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progress}%` }} />
                                                </div>
                                                <span className="text-xs text-slate-400 shrink-0">{progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs text-slate-500">{enrollDate}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8 text-slate-500 hover:text-indigo-400 transition-all bg-transparent border-0 hover:bg-white/5">
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {enrollments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-slate-500">
                                        <Users className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                                        Chưa có học viên nào đăng ký
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
