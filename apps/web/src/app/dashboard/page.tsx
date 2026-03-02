import { MainLayout } from "@/components/layouts/MainLayout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    BookOpen, Trophy, Flame, Clock, Bot, Pin,
    TrendingUp, ChevronRight, Sparkles, BarChart3, School
} from "lucide-react";

const levelMap: Record<string, string> = {
    beginner: 'Cơ bản',
    intermediate: 'Trung bình',
    advanced: 'Nâng cao',
};

const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MOCK_ACTIVITY = [30, 45, 70, 50, 60, 20, 10];

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const displayName = user.user_metadata?.full_name
        || user.email?.split('@')[0]
        || 'Học viên';
    const initials = displayName.charAt(0).toUpperCase();
    const avatarUrl = user.user_metadata?.avatar_url;

    // Fetch enrollments with course info
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*, courses(id, title, slug, thumbnail_url, level, total_lessons, categories(name))')
        .eq('user_id', user.id)
        .order('last_accessed_at', { ascending: false })
        .limit(5);

    const totalEnrolled = enrollments?.length ?? 0;
    const avgProgress = enrollments?.length
        ? Math.round(enrollments.reduce((s, e) => s + (e.progress_percent ?? 0), 0) / enrollments.length)
        : 0;

    return (
        <MainLayout>
            <div className="min-h-screen bg-[#010816]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

                    {/* Hero Banner */}
                    <div className="w-full bg-linear-to-r from-indigo-600 to-indigo-900 rounded-2xl p-6 md:p-10 relative overflow-hidden shadow-lg shadow-indigo-900/50 border border-indigo-500/30">
                        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,_white,_transparent)] scale-150 translate-x-10 pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 size-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-2">
                                    Chào mừng trở lại, {displayName.split(' ').pop()}! 👋
                                </h1>
                                <p className="text-indigo-200/80 text-base italic flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    Code là nghệ thuật, bạn là nghệ sĩ.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="" className="size-16 rounded-full border-2 border-white/30 shadow-xl" />
                                ) : (
                                    <div className="size-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                                        {initials}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: BookOpen, label: 'Khóa đang học', value: totalEnrolled, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                            { icon: TrendingUp, label: 'Tiến độ TB', value: `${avgProgress}%`, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                            { icon: Flame, label: 'Streak', value: '7 ngày', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
                            { icon: Trophy, label: 'Huy hiệu', value: '4', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                        ].map(({ icon: Icon, label, value, color, bg }) => (
                            <div key={label} className={`rounded-xl p-4 border ${bg} bg-[#111827] flex flex-col gap-2`}>
                                <div className={`${color} p-2 rounded-lg w-fit bg-current/10`}>
                                    <Icon className={`w-5 h-5 ${color}`} />
                                </div>
                                <div className="text-2xl font-bold text-white">{value}</div>
                                <div className="text-xs text-slate-400">{label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Column */}
                        <div className="flex-1 flex flex-col gap-6">

                            {/* Enrolled Courses */}
                            <div className="bg-[#111827] rounded-xl border border-indigo-900/50 overflow-hidden">
                                <div className="flex justify-between items-center p-5 border-b border-indigo-900/30">
                                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-indigo-400" />
                                        Khóa học đang học
                                    </h3>
                                    <Link href="/courses" className="text-sm text-indigo-400 hover:text-amber-400 transition-colors font-medium">
                                        Khám phá thêm →
                                    </Link>
                                </div>
                                <div className="divide-y divide-indigo-900/30">
                                    {enrollments && enrollments.length > 0 ? enrollments.map((enrollment) => {
                                        const course = enrollment.courses as unknown as {
                                            id: string; title: string; slug: string;
                                            thumbnail_url: string | null; level: string;
                                            total_lessons: number;
                                            categories: { name: string } | null;
                                        } | null;
                                        if (!course) return null;
                                        const progress = enrollment.progress_percent ?? 0;
                                        return (
                                            <Link
                                                key={enrollment.id}
                                                href={`/courses/${course.slug}`}
                                                className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all group"
                                            >
                                                {course.thumbnail_url ? (
                                                    <img src={course.thumbnail_url} alt="" className="size-14 rounded-lg object-cover shrink-0" />
                                                ) : (
                                                    <div className="size-14 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                                        <BookOpen className="w-6 h-6 text-indigo-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0 gap-1 flex flex-col">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <p className="text-white font-bold text-sm truncate group-hover:text-indigo-300 transition-colors">
                                                            {course.title}
                                                        </p>
                                                        <span className="text-xs font-medium bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded shrink-0">
                                                            {progress > 0 ? 'Tiếp tục' : 'Bắt đầu'}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-400 text-xs">{levelMap[course.level] ?? course.level} · {course.total_lessons} bài học</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex-1 h-1.5 bg-[#010816] rounded-full overflow-hidden">
                                                            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                                                        </div>
                                                        <span className="text-xs text-slate-400 shrink-0">{progress}%</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                                            </Link>
                                        );
                                    }) : (
                                        <div className="p-10 text-center">
                                            <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                            <p className="text-slate-400 mb-4">Bạn chưa đăng ký khóa học nào</p>
                                            <Link href="/courses" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
                                                <Sparkles className="w-4 h-4" /> Khám phá khóa học
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Activity Chart */}
                            <div className="bg-[#111827] rounded-xl p-6 border border-indigo-900/50">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-indigo-400" />
                                        Hoạt động học tập
                                    </h3>
                                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Tuần này</span>
                                </div>
                                <div className="flex items-end justify-between gap-2 h-32 px-2">
                                    {DAY_LABELS.map((day, i) => {
                                        const height = MOCK_ACTIVITY[i];
                                        const isToday = i === 2;
                                        return (
                                            <div key={day} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                                                <div
                                                    className={`w-full max-w-[28px] rounded-t-sm transition-all ${isToday ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-700 group-hover:bg-indigo-500/50'}`}
                                                    style={{ height: `${height}%` }}
                                                />
                                                <span className={`text-xs ${isToday ? 'text-white font-bold' : 'text-slate-400'}`}>{day}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                                    <span>Tổng giờ: <strong className="text-white">12.5h</strong></span>
                                    <span>Mục tiêu: <strong className="text-white">15h</strong></span>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="bg-[#111827] rounded-xl p-6 border border-indigo-900/50">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-amber-400" />
                                        Huy hiệu đạt được
                                    </h3>
                                    <button className="text-sm text-indigo-400 hover:text-amber-400 transition-colors">Xem tất cả</button>
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-1">
                                    {[
                                        { icon: '🔥', label: '7 Ngày Streak', earned: true },
                                        { icon: '🐛', label: 'Bug Hunter', earned: true },
                                        { icon: '⚔️', label: 'Code Warrior', earned: true },
                                        { icon: '🎓', label: 'Học bá', earned: true },
                                        { icon: '⚛️', label: 'React Master', earned: false },
                                    ].map(({ icon, label, earned }) => (
                                        <div key={label} className={`min-w-[90px] bg-[#010816] border rounded-lg p-3 flex flex-col items-center gap-2 cursor-pointer transition-colors ${earned ? 'border-indigo-500/20 hover:border-amber-500/50' : 'border-slate-800/50 opacity-40 grayscale'}`}>
                                            <div className={`text-2xl p-2 rounded-full ${earned ? 'bg-amber-500/10' : 'bg-slate-700'}`}>{icon}</div>
                                            <span className="text-xs font-medium text-center text-slate-300 line-clamp-1">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-5">
                            {/* Overall Progress */}
                            <div className="bg-[#111827] rounded-xl p-6 border border-indigo-900/50 flex flex-col items-center">
                                <h3 className="text-white text-base font-bold mb-5 w-full flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-400" /> Tiến độ tổng thể
                                </h3>
                                <div className="relative size-36">
                                    <div
                                        className="size-full rounded-full flex items-center justify-center"
                                        style={{ background: `conic-gradient(#f59e0b ${avgProgress}%, #111827 0)` }}
                                    >
                                        <div className="bg-[#111827] rounded-full size-28 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-bold text-white">{avgProgress}%</span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Hoàn thành</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-xs mt-5 text-center">
                                    {avgProgress > 50 ? 'Bạn đang tiến bộ rất tốt!' : 'Hãy tiếp tục học đều mỗi ngày!'}
                                </p>
                            </div>

                            {/* AI Tutor CTA */}
                            <div className="relative bg-linear-to-br from-[#111827] to-[#010816] rounded-xl p-6 border border-indigo-500 shadow-lg overflow-hidden group">
                                <div className="absolute -right-4 -top-4 size-24 bg-indigo-500/20 blur-2xl rounded-full pointer-events-none" />
                                <div className="absolute -left-4 -bottom-4 size-20 bg-amber-500/20 blur-xl rounded-full pointer-events-none" />
                                <div className="relative z-10 flex flex-col gap-4 items-start">
                                    <div className="size-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-glow-indigo">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white text-base font-bold">Trợ lý AI</h3>
                                        <p className="text-slate-400 text-sm mt-1">Gặp khó khăn? Hỏi AI ngay để được giải đáp tức thì.</p>
                                    </div>
                                    <Link
                                        href="/ai/chat"
                                        className="w-full mt-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
                                    >
                                        Chat ngay <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="bg-[#111827] rounded-xl p-5 border border-indigo-900/50 flex flex-col gap-3">
                                <h3 className="text-white text-base font-bold">Khám phá nhanh</h3>
                                {[
                                    { label: 'Tất cả khóa học', href: '/courses', icon: BookOpen },
                                    { label: 'Lớp học của tôi', href: '/classroom/1', icon: School },
                                    { label: 'Lộ trình học tập', href: '/roadmap', icon: TrendingUp },
                                    { label: 'Bảng xếp hạng', href: '/leaderboard', icon: Trophy },
                                ].map(({ label, href, icon: Icon }) => (
                                    <Link key={href} href={href} className="flex items-center gap-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg transition-all group">
                                        <Icon className="w-4 h-4 text-indigo-400 group-hover:text-amber-400 transition-colors" />
                                        {label}
                                        <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
