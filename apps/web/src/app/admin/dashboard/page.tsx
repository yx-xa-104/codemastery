import { AdminLayout } from "@/components/layouts/AdminLayout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Users, BookOpen, MessageSquare, Star, TrendingUp,
    ChevronRight, Circle, Video
} from "lucide-react";

const MOCK_COURSES = [
    { tag: 'HTML', color: 'text-orange-400 bg-orange-500/20 border-orange-500/30', title: 'Lập trình Web Frontend Cơ bản', status: 'active', students: 456, updatedAt: '2 ngày trước' },
    { tag: 'JS', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30', title: 'JavaScript Nâng cao & ES6+', status: 'active', students: 215, updatedAt: '1 tuần trước' },
    { tag: 'PY', color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30', title: 'Python cho Khoa học Dữ liệu', status: 'draft', students: 0, updatedAt: '5 phút trước' },
];

const MOCK_QUESTIONS = [
    { name: 'Lê Văn Cường', lesson: 'Bài 4: CSS Flexbox', time: '10 phút trước', q: 'Tại sao justify-content: space-between không hoạt động khi tôi đặt height cố định cho container?' },
    { name: 'Phạm Thị Mai', lesson: 'Bài 12: React Hooks', time: '1 giờ trước', q: 'useEffect với dependency array rỗng thì chạy mấy lần ạ?' },
];

const MOCK_NEW_STUDENTS = [
    { name: 'Trần Văn Minh', course: 'HTML Frontend', time: '2p trước' },
    { name: 'Nguyễn Thị Lan', course: 'JS Nâng cao', time: '15p trước' },
    { name: 'Hoàng Nam', course: 'Python Data', time: '1g trước' },
    { name: 'Đỗ Hiếu', course: 'Frontend Web', time: '3g trước' },
];

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
    const { count: enrollCount } = await supabase.from('enrollments').select('*', { count: 'exact', head: true });

    const stats = [
        { label: 'Tổng học viên', value: enrollCount ?? 1248, change: '+12%', icon: Users, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
        { label: 'Câu hỏi đã giải', value: 856, change: '+24 tuần này', icon: MessageSquare, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        { label: 'Đánh giá TB', value: '4.8', change: '/ 5.0 (342)', icon: Star, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
        { label: 'Khóa học', value: courseCount ?? 3, change: 'đang hoạt động', icon: Video, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    ];

    return (
        <AdminLayout title="Bảng điều khiển Giảng viên" subtitle="Chào mừng trở lại, chúc một ngày dạy học hiệu quả!">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {stats.map(({ label, value, change, icon: Icon, color }) => (
                    <div key={label} className="bg-[#0B1120] border border-indigo-900/30 rounded-xl p-5 hover:border-indigo-500/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg border ${color}`}><Icon className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs font-medium text-slate-400">{label}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-bold text-white">{value}</p>
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
                {/* Left: courses + questions */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Courses table */}
                    <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-indigo-900/30 flex justify-between items-center">
                            <h3 className="text-base font-semibold text-white flex items-center gap-2">
                                <Video className="w-4 h-4 text-indigo-400" /> Quản lý khóa học
                            </h3>
                            <Link href="/admin/courses" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Xem tất cả</Link>
                        </div>
                        <div className="divide-y divide-slate-800">
                            {MOCK_COURSES.map(c => (
                                <div key={c.title} className="p-5 hover:bg-white/5 transition-colors group">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-4">
                                            <div className={`size-11 rounded-lg border flex items-center justify-center font-bold text-sm shrink-0 ${c.color}`}>{c.tag}</div>
                                            <div>
                                                <h4 className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">{c.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Circle className={`w-1.5 h-1.5 fill-current ${c.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`} />
                                                        {c.status === 'active' ? 'Đang hoạt động' : 'Bản nháp'}
                                                    </span>
                                                    <span>• {c.students} học viên</span>
                                                    <span>• {c.updatedAt}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button className="px-3 py-1.5 text-xs font-medium text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-all">Phân tích</button>
                                            <button className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all">Chỉnh sửa</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending questions */}
                    <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-indigo-900/30 flex justify-between items-center">
                            <h3 className="text-base font-semibold text-white flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-amber-400" /> Câu hỏi chờ giải đáp
                            </h3>
                            <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded border border-red-500/20">5 Mới</span>
                        </div>
                        <div className="p-5 space-y-3">
                            {MOCK_QUESTIONS.map(q => (
                                <div key={q.name} className="bg-[#010816] rounded-lg p-4 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="size-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">{q.name[0]}</div>
                                            <span className="text-sm text-slate-300 font-medium">{q.name}</span>
                                            <span className="text-xs text-slate-500">• {q.lesson}</span>
                                        </div>
                                        <span className="text-xs text-slate-500">{q.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-200 mb-3 line-clamp-2">{q.q}</p>
                                    <div className="flex items-center gap-3">
                                        <Link href="/admin/messages" className="text-xs flex items-center gap-1 text-indigo-400 hover:text-white transition-colors">
                                            <ChevronRight className="w-3 h-3" /> Trả lời
                                        </Link>
                                        <button className="text-xs flex items-center gap-1 text-slate-500 hover:text-amber-400 transition-colors">✦ Gợi ý AI</button>
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
                        <h3 className="text-base font-semibold text-white">Học viên mới</h3>
                    </div>
                    <ul className="divide-y divide-slate-800 p-2 flex-1">
                        {MOCK_NEW_STUDENTS.map(s => (
                            <li key={s.name} className="p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0 group-hover:border-amber-500/50 transition-colors">
                                        {s.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{s.name}</p>
                                        <p className="text-xs text-slate-500 truncate">Đăng ký: {s.course}</p>
                                    </div>
                                    <div className="text-xs text-slate-500 shrink-0">{s.time}</div>
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
