import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { TrendingUp, Users, BookOpen, Star, Download } from "lucide-react";
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

export default async function AdminReportsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const cookieStore = await cookies();

    const [stats, topCourses, chartData] = await Promise.all([
        fetchAPI('/api/admin/reports/stats', cookieStore),
        fetchAPI('/api/admin/reports/top-courses', cookieStore),
        fetchAPI('/api/admin/reports/enrollments-chart', cookieStore),
    ]);

    const enrollChart: { label: string; count: number }[] = chartData ?? [];
    const maxEnroll = Math.max(...enrollChart.map(d => d.count), 1);
    const topCoursesData: any[] = topCourses ?? [];
    const maxEnrollTop = Math.max(...topCoursesData.map(c => c.total_enrollments || 0), 1);

    return (
        <AdminLayout
            title="Báo cáo & Thống kê"
            subtitle="Tổng quan hoạt động nền tảng"
            action={
                <Button variant="outline" className="flex items-center gap-2 px-4 py-2 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800 text-sm font-medium rounded-lg transition-all h-auto">
                    <Download className="w-4 h-4" /> Xuất báo cáo
                </Button>
            }
        >
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { icon: Users, label: 'Tổng học viên', value: stats?.totalStudents ?? 0, delta: 'Toàn hệ thống' },
                    { icon: BookOpen, label: 'Lượt đăng ký', value: stats?.totalEnrollments ?? 0, delta: 'Tổng cộng' },
                    { icon: Star, label: 'Đánh giá TB', value: stats?.avgRating ?? '0', delta: `${stats?.reviewCount ?? 0} đánh giá` },
                    { icon: TrendingUp, label: 'Khóa học', value: stats?.totalCourses ?? 0, delta: 'Tổng' },
                ].map(({ icon: Icon, label, value, delta }) => (
                    <div key={label} className="bg-[#0B1120] border border-indigo-900/30 rounded-xl p-5">
                        <div className="flex justify-between items-start mb-3">
                            <p className="text-xs font-medium text-slate-400">{label}</p>
                            <Icon className="w-4 h-4 text-indigo-400" />
                        </div>
                        <p className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                        <p className="text-xs text-green-400 font-medium mt-1">{delta}</p>
                    </div>
                ))}
            </div>

            {/* Enrollment chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="font-bold text-white text-sm">Học viên đăng ký mới</h3>
                        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">7 ngày qua</span>
                    </div>
                    <div className="flex items-end gap-2 h-36">
                        {enrollChart.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                <span className="text-[10px] text-slate-400">{d.count}</span>
                                <div
                                    className={`w-full rounded-t transition-all ${d.count === Math.max(...enrollChart.map(x => x.count)) ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'bg-slate-700 hover:bg-indigo-500/50'}`}
                                    style={{ height: `${(d.count / maxEnroll) * 100}%`, minHeight: d.count > 0 ? '4px' : '0px' }}
                                />
                                <span className="text-[10px] text-slate-500">{d.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                        <span>Tổng tuần: <strong className="text-white">{enrollChart.reduce((a, b) => a + b.count, 0)}</strong> học viên</span>
                        <span>TB/ngày: <strong className="text-white">{enrollChart.length > 0 ? Math.round(enrollChart.reduce((a, b) => a + b.count, 0) / enrollChart.length) : 0}</strong></span>
                    </div>
                </div>

                {/* Placeholder for a second chart card */}
                <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                    <TrendingUp className="w-10 h-10 text-slate-700 mb-3" />
                    <p className="text-slate-400 text-sm font-medium mb-1">Biểu đồ tiến độ</p>
                    <p className="text-xs text-slate-500">Đang phát triển — sẽ hiển thị tỷ lệ hoàn thành khóa học</p>
                </div>
            </div>

            {/* Top courses */}
            <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-indigo-900/30 flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm">Top Khóa học phổ biến</h3>
                </div>
                <div className="p-5 space-y-4">
                    {topCoursesData.length === 0 ? (
                        <p className="text-center text-sm text-slate-500 py-4">Chưa có dữ liệu</p>
                    ) : topCoursesData.map((c: any, i: number) => (
                        <div key={c.id} className="flex items-center gap-4">
                            <span className="text-lg font-bold text-slate-600 w-6 shrink-0">#{i + 1}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white mb-1 truncate">{c.title}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${((c.total_enrollments || 0) / maxEnrollTop) * 100}%` }} />
                                    </div>
                                    <span className="text-xs text-slate-400 shrink-0">{Math.round(((c.total_enrollments || 0) / maxEnrollTop) * 100)}%</span>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-xs font-medium text-white">{(c.total_enrollments || 0).toLocaleString()} HV</p>
                                <p className="text-xs text-amber-400">⭐ {c.avg_rating?.toFixed(1) ?? '–'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
