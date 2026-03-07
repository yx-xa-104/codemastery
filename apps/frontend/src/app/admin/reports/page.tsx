import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { TrendingUp, Users, BookOpen, Star, Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const WEEK_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const ENROLL_DATA = [18, 32, 27, 45, 38, 22, 15];
const REVENUE_DATA = [1.2, 2.4, 1.8, 3.1, 2.7, 1.5, 0.9];

export default async function AdminReportsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const cookieStore = await cookies();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    let totalStudents = 0, totalEnrollments = 0, totalCourses = 0;

    try {
        const res = await fetch(`${API_URL}/api/admin/reports/stats`, {
            headers: { Cookie: cookieStore.toString() },
            cache: 'no-store'
        });
        if (res.ok) {
            const data = await res.json();
            if (data.totalStudents !== undefined) totalStudents = data.totalStudents;
            if (data.totalEnrollments !== undefined) totalEnrollments = data.totalEnrollments;
            if (data.totalCourses !== undefined) totalCourses = data.totalCourses;
        }
    } catch (e) {
        console.error("Failed to fetch admin report stats", e);
    }

    const maxEnroll = Math.max(...ENROLL_DATA);
    const maxRevenue = Math.max(...REVENUE_DATA);

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
                    { icon: Users, label: 'Tổng học viên', value: totalStudents ?? 0, delta: '+12%' },
                    { icon: BookOpen, label: 'Lượt đăng ký', value: totalEnrollments ?? 0, delta: '+8%' },
                    { icon: Star, label: 'Đánh giá TB', value: '4.8', delta: '+0.2' },
                    { icon: TrendingUp, label: 'Khóa học hoạt động', value: totalCourses ?? 0, delta: 'Tổng' },
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Enrollment chart */}
                <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="font-bold text-white text-sm">Học viên đăng ký mới</h3>
                        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Tuần này</span>
                    </div>
                    <div className="flex items-end gap-2 h-36">
                        {ENROLL_DATA.map((v, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                <span className="text-[10px] text-slate-400">{v}</span>
                                <div
                                    className={`w-full rounded-t transition-all ${i === 3 ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'bg-slate-700 hover:bg-indigo-500/50'}`}
                                    style={{ height: `${(v / maxEnroll) * 100}%` }}
                                />
                                <span className={`text-[10px] ${i === 3 ? 'text-white font-bold' : 'text-slate-500'}`}>{WEEK_LABELS[i]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                        <span>Tổng tuần: <strong className="text-white">{ENROLL_DATA.reduce((a, b) => a + b, 0)}</strong> học viên</span>
                        <span>TB/ngày: <strong className="text-white">{Math.round(ENROLL_DATA.reduce((a, b) => a + b, 0) / 7)}</strong></span>
                    </div>
                </div>

                {/* Revenue chart */}
                <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="font-bold text-white text-sm">Doanh thu (triệu VND)</h3>
                        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Tuần này</span>
                    </div>
                    <div className="flex items-end gap-2 h-36">
                        {REVENUE_DATA.map((v, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                <span className="text-[10px] text-slate-400">{v}M</span>
                                <div
                                    className={`w-full rounded-t transition-all ${i === 3 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-slate-700 hover:bg-amber-500/50'}`}
                                    style={{ height: `${(v / maxRevenue) * 100}%` }}
                                />
                                <span className={`text-[10px] ${i === 3 ? 'text-white font-bold' : 'text-slate-500'}`}>{WEEK_LABELS[i]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                        <span>Doanh thu tuần: <strong className="text-white">{REVENUE_DATA.reduce((a, b) => a + b, 0).toFixed(1)}M</strong></span>
                        <span className="text-green-400 font-medium">↑ +23% vs tuần trước</span>
                    </div>
                </div>
            </div>

            {/* Top courses */}
            <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-indigo-900/30 flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm">Top Khóa học phổ biến</h3>
                </div>
                <div className="p-5 space-y-4">
                    {[
                        { title: 'Lập trình Web Frontend Cơ bản', students: 456, rating: 4.9, percent: 92 },
                        { title: 'JavaScript Nâng cao & ES6+', students: 215, rating: 4.7, percent: 58 },
                        { title: 'Python cho Khoa học Dữ liệu', students: 189, rating: 4.8, percent: 45 },
                    ].map((c, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="text-lg font-bold text-slate-600 w-6 shrink-0">#{i + 1}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white mb-1 truncate">{c.title}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${c.percent}%` }} />
                                    </div>
                                    <span className="text-xs text-slate-400 shrink-0">{c.percent}%</span>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-xs font-medium text-white">{c.students.toLocaleString()} HV</p>
                                <p className="text-xs text-amber-400">⭐ {c.rating}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
