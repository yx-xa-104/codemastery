import { TeacherLayout } from "@/features/teacher/components/TeacherLayout";
import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { BookOpen, Users, TrendingUp, Plus, BarChart2 } from "lucide-react";

export default async function TeacherDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const cookieStore = await cookies();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    let courseCount = 0;
    let enrollmentCount = 0;
    let courses: any[] = [];
    try {
        const res = await fetch(`${API_URL}/api/courses/my`, {
            headers: { Cookie: cookieStore.toString() },
            cache: 'no-store'
        });
        if (res.ok) {
            courses = await res.json();
            courseCount = courses.length;
            enrollmentCount = courses.reduce((sum: number, c: any) => sum + (c.total_enrollments || 0), 0);
        }
    } catch (err) {
        console.error("Failed to fetch teacher data", err);
    }

    return (
        <TeacherLayout title="Tổng quan" subtitle="Quản lý khóa học và nội dung của bạn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    { icon: BookOpen, label: 'Khóa học', value: courseCount, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                    { icon: Users, label: 'Tổng ghi danh', value: enrollmentCount, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                    { icon: TrendingUp, label: 'Đánh giá TB', value: '—', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className={`bg-[#0B1120] border rounded-xl p-5 flex items-center gap-4 ${color.split(' ').slice(1).join(' ')}`}>
                        <div className={`p-3 rounded-lg border ${color}`}><Icon className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-slate-400">{label}</p>
                            <p className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent courses */}
            <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl p-6">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="font-bold text-white">Khóa học gần đây</h3>
                    <Link href="/teacher/courses" className="text-xs text-indigo-400 hover:text-indigo-300">Xem tất cả →</Link>
                </div>
                {courses.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-400 mb-4">Bạn chưa tạo khóa học nào</p>
                        <Link href="/teacher/courses/create" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-lg">
                            <Plus className="w-4 h-4" /> Tạo khóa học đầu tiên
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {courses.slice(0, 5).map((c: any) => (
                            <Link key={c.id} href={`/teacher/courses`}
                                className="flex items-center gap-4 p-3 bg-[#010816] rounded-xl border border-indigo-900/20 hover:border-indigo-500/30 transition-colors">
                                <div className="size-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-4 h-4 text-slate-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{c.title}</p>
                                    <p className="text-xs text-slate-500">{c.total_enrollments || 0} học viên • {c.total_lessons || 0} bài</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
