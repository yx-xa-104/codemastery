export const dynamic = 'force-dynamic';

import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    BookOpen, Trophy, Flame, Clock, Bot,
    TrendingUp, ChevronRight, Sparkles, BarChart3, Pin, Zap
} from "lucide-react";

const levelMap: Record<string, string> = {
    beginner: 'Cơ bản',
    intermediate: 'Trung bình',
    advanced: 'Nâng cao',
};

const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    const displayName = user.user_metadata?.full_name
        || user.email?.split('@')[0]
        || 'Học viên';
    const initials = displayName.charAt(0).toUpperCase();
    const avatarUrl = user.user_metadata?.avatar_url;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const authHeaders: Record<string, string> = {};
    if (accessToken) {
        authHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    // Fetch enrollments
    type EnrollmentRow = {
        id: string;
        course_id: string;
        progress_percent: number | null;
        is_pinned?: boolean;
        last_accessed_at: string | null;
        courses: {
            id: string; title: string; slug: string;
            thumbnail_url: string | null; level: string;
            total_lessons: number;
            categories: { name: string } | null;
        } | null;
    };

    let enrollments: EnrollmentRow[] = [];
    try {
        const res = await fetch(`${API_URL}/api/enrollments`, {
            headers: authHeaders, cache: 'no-store'
        });
        if (res.ok) enrollments = await res.json();
    } catch (err) {
        console.error("Failed to fetch enrollments", err);
    }

    // Fetch pinned courses
    let pinnedCourses: EnrollmentRow[] = [];
    try {
        const res = await fetch(`${API_URL}/api/enrollments/pinned`, {
            headers: authHeaders, cache: 'no-store'
        });
        if (res.ok) pinnedCourses = await res.json();
    } catch (err) {
        console.error("Failed to fetch pinned courses", err);
    }

    // Fetch learning activity
    type ActivityRow = { activity_date: string; lessons_completed: number; duration_minutes: number };
    let activityData: ActivityRow[] = [];
    try {
        const res = await fetch(`${API_URL}/api/enrollments/activity?days=7`, {
            headers: authHeaders, cache: 'no-store'
        });
        if (res.ok) activityData = await res.json();
    } catch (err) {
        console.error("Failed to fetch activity", err);
    }

    // Fetch gamification stats
    type GamificationStats = { xp: number; streak_days: number; rank: number };
    let gamStats: GamificationStats = { xp: 0, streak_days: 0, rank: 0 };
    try {
        const res = await fetch(`${API_URL}/api/gamification/my-stats`, {
            headers: authHeaders, cache: 'no-store'
        });
        if (res.ok) gamStats = await res.json();
    } catch (err) {
        console.error("Failed to fetch gamification stats", err);
    }

    const totalEnrolled = enrollments.length;
    const avgProgress = enrollments.length
        ? Math.round(enrollments.reduce((s, e) => s + (e.progress_percent ?? 0), 0) / enrollments.length)
        : 0;
    const recentEnrollments = enrollments.slice(0, 5);

    // Map activity to week chart
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekActivity = DAY_LABELS.map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + mondayOffset + i);
        const dateStr = d.toISOString().split('T')[0];
        const match = activityData.find(a => a.activity_date === dateStr);
        return match?.lessons_completed ?? 0;
    });
    const maxActivity = Math.max(...weekActivity, 1);
    const totalLessonsWeek = weekActivity.reduce((s, v) => s + v, 0);
    const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    return (
        <MainLayout>
            <div className="min-h-screen relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">

                    {/* Hero Banner */}
                    <div className="w-full bg-zinc-900/30 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-xl border border-white/5">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <h1 className="text-zinc-100 text-3xl md:text-5xl font-bold tracking-tight mb-4">
                                    Chào mừng, {displayName.split(' ').pop()}! 👋
                                </h1>
                                <p className="text-zinc-400 text-lg font-light flex items-center gap-2">
                                    Tiếp tục hành trình làm chủ công nghệ của bạn.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="" className="w-20 h-20 rounded-full border border-white/10 object-cover shadow-2xl" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 text-3xl font-medium shadow-2xl">
                                        {initials}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: BookOpen, label: 'Khóa đang học', value: totalEnrolled },
                            { icon: Zap, label: 'XP tích lũy', value: gamStats.xp.toLocaleString() },
                            { icon: Flame, label: 'Chuỗi ngày', value: `${gamStats.streak_days}` },
                            { icon: Trophy, label: 'Xếp hạng', value: `#${gamStats.rank}` },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="rounded-2xl p-6 border border-white/5 bg-zinc-900/30 backdrop-blur-md flex flex-col gap-3 group hover:bg-white/[0.02] transition-colors">
                                <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-3xl font-semibold text-zinc-100 tracking-tight">{value}</div>
                                    <div className="text-sm text-zinc-500 mt-1 font-medium">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pinned Courses */}
                    {pinnedCourses.length > 0 && (
                        <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
                            <div className="flex justify-between items-center p-5 md:p-6 border-b border-white/5">
                                <h3 className="text-zinc-100 text-lg font-bold flex items-center gap-2">
                                    <Pin className="w-5 h-5 text-zinc-400" />
                                    Khóa học đã ghim
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y divide-white/5 sm:divide-y-0 sm:divide-x">
                                {pinnedCourses.map((enrollment) => {
                                    const course = enrollment.courses as any;
                                    if (!course) return null;
                                    const progress = enrollment.progress_percent ?? 0;
                                    return (
                                        <Link key={enrollment.id} href={`/courses/${course.slug}`}
                                            className="flex items-center gap-4 p-5 md:p-6 hover:bg-white/[0.02] transition-colors group">
                                            {course.thumbnail_url ? (
                                                <img src={course.thumbnail_url} alt="" className="size-14 rounded-xl object-cover shrink-0 border border-white/5" />
                                            ) : (
                                                <div className="size-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                    <BookOpen className="w-6 h-6 text-zinc-400" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-zinc-100 font-semibold text-sm truncate group-hover:text-white transition-colors">{course.title}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-zinc-300 rounded-full" style={{ width: `${progress}%` }} />
                                                    </div>
                                                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 shrink-0">{progress}%</span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column */}
                        <div className="flex-1 flex flex-col gap-8">

                            {/* Enrolled Courses */}
                            <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
                                <div className="flex justify-between items-center p-5 md:p-6 border-b border-white/5">
                                    <h3 className="text-zinc-100 text-lg font-bold flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-zinc-400" />
                                        Khóa học đang học
                                    </h3>
                                    <Link href="/courses" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium">
                                        Khám phá thêm →
                                    </Link>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {recentEnrollments && recentEnrollments.length > 0 ? recentEnrollments.map((enrollment) => {
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
                                                className="flex items-center gap-4 p-5 md:p-6 hover:bg-white/[0.02] transition-colors group"
                                            >
                                                {course.thumbnail_url ? (
                                                    <img src={course.thumbnail_url} alt="" className="size-16 md:size-20 rounded-xl object-cover shrink-0 border border-white/5 group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="size-16 md:size-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                        <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-zinc-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0 gap-1 flex flex-col justify-center">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <p className="text-zinc-100 font-semibold text-base truncate group-hover:text-white transition-colors">
                                                            {course.title}
                                                        </p>
                                                        <span className="text-[10px] uppercase font-bold tracking-wider bg-white/5 text-zinc-300 px-2 py-1 rounded-sm shrink-0 border border-white/5 hidden sm:block">
                                                            {progress > 0 ? 'Tiếp tục' : 'Bắt đầu'}
                                                        </span>
                                                    </div>
                                                    <p className="text-zinc-500 text-xs md:text-sm font-medium">{levelMap[course.level] ?? course.level} · {course.total_lessons} bài học</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-zinc-300 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                                                        </div>
                                                        <span className="text-xs font-bold text-zinc-400 shrink-0">{progress}%</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0 ml-2" />
                                            </Link>
                                        );
                                    }) : (
                                        <div className="p-12 text-center flex flex-col items-center">
                                            <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                                                <BookOpen className="w-8 h-8 text-zinc-500" />
                                            </div>
                                            <p className="text-zinc-400 mb-5 font-medium">Bạn chưa đăng ký khóa học nào</p>
                                            <Link href="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 text-sm font-semibold rounded-xl transition-colors">
                                                <Sparkles className="w-4 h-4" /> Khám phá khóa học
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Activity Chart — Real Data */}
                            <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-zinc-100 text-lg font-bold flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-zinc-400" />
                                        Hoạt động học tập
                                    </h3>
                                    <span className="text-xs font-semibold text-zinc-400 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">Tuần này</span>
                                </div>

                                {/* Chart */}
                                <div className="relative mt-4">
                                    {/* Grid lines */}
                                    <div className="absolute inset-x-0 top-0 flex flex-col justify-between pointer-events-none" style={{ height: 160 }}>
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} className="border-b border-white/5" />
                                        ))}
                                    </div>

                                    {/* Bars row */}
                                    <div className="relative flex items-end justify-between gap-3 px-2 sm:px-6" style={{ height: 160 }}>
                                        {DAY_LABELS.map((day, i) => {
                                            const val = weekActivity[i];
                                            const expectedMax = Math.max(maxActivity, 10);
                                            const barHeight = val > 0
                                                ? Math.max(Math.round((val / expectedMax) * 148), 8)
                                                : 4;
                                            const isToday = i === todayIdx;

                                            return (
                                                <div key={day} className="flex flex-col items-center flex-1 group cursor-pointer relative z-10 w-full">
                                                    <div className="w-full flex justify-center">
                                                        <div
                                                            className={`w-full max-w-[32px] rounded-t-lg transition-all duration-500 ease-out ${
                                                                isToday
                                                                    ? 'bg-zinc-100 shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:scale-y-105 origin-bottom'
                                                                    : val > 0
                                                                        ? 'bg-zinc-400/80 group-hover:bg-zinc-300 group-hover:scale-y-105 origin-bottom'
                                                                        : 'bg-white/5 group-hover:bg-white/10'
                                                            }`}
                                                            style={{ height: barHeight }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Values row */}
                                    <div className="flex justify-between gap-3 px-2 sm:px-6 mt-3">
                                        {DAY_LABELS.map((day, i) => {
                                            const val = weekActivity[i];
                                            const isToday = i === todayIdx;
                                            return (
                                                <div key={day} className="flex-1 text-center">
                                                    <span className={`text-xs font-bold ${
                                                        val > 0
                                                            ? isToday ? 'text-zinc-100' : 'text-zinc-400'
                                                            : 'text-zinc-700'
                                                    }`}>
                                                        {val > 0 ? val : '·'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Day labels row */}
                                    <div className="flex justify-between gap-3 px-2 sm:px-6 mt-1">
                                        {DAY_LABELS.map((day, i) => {
                                            const val = weekActivity[i];
                                            const isToday = i === todayIdx;
                                            return (
                                                <div key={day} className="flex-1 text-center relative">
                                                    <span className={`text-[11px] uppercase tracking-wider font-semibold ${
                                                        isToday
                                                            ? 'text-zinc-100'
                                                            : val > 0
                                                                ? 'text-zinc-500'
                                                                : 'text-zinc-600'
                                                    }`}>
                                                        {day}
                                                    </span>
                                                    {isToday && (
                                                        <div className="w-1 h-1 rounded-full bg-zinc-300 mx-auto mt-1 absolute left-1/2 -bottom-2 -translate-x-1/2" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Summary footer */}
                                <div className="mt-8 pt-5 border-t border-white/5 flex justify-between items-center px-2">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-zinc-400" />
                                            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Bài hoàn thành: <strong className="text-zinc-200 ml-1 text-sm">{totalLessonsWeek}</strong></span>
                                        </div>
                                    </div>
                                    <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        Hôm nay: <strong className="text-zinc-200 mx-1 border border-white/10 px-2 py-0.5 rounded text-sm">{weekActivity[todayIdx]}</strong> bài
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-5">
                            {/* Overall Progress */}
                            <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 flex flex-col items-center">
                                <h3 className="text-zinc-100 text-sm font-medium mb-8 w-full flex items-center justify-between">
                                    Tiến độ tổng thể
                                    <Clock className="w-4 h-4 text-zinc-500" /> 
                                </h3>
                                <div className="relative size-40 group">
                                    <div
                                        className="size-full rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                                        style={{ background: `conic-gradient(#e4e4e7 ${avgProgress}%, rgba(255,255,255,0.05) 0)` }}
                                    >
                                        <div className="bg-[#050505] rounded-full size-[140px] flex flex-col items-center justify-center border border-white/5 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                            <span className="text-4xl font-bold tracking-tight text-white">{avgProgress}%</span>
                                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Đã hoàn thành</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-zinc-400 text-sm mt-8 text-center font-medium">
                                    {avgProgress > 50 ? 'Bạn đang tiến bộ rất tốt! 🚀' : 'Hôm nay học bài gì đây? 🎯'}
                                </p>
                            </div>

                            {/* AI Tutor CTA */}
                            <div className="relative bg-zinc-900/30 rounded-2xl p-6 border border-white/5 overflow-hidden group backdrop-blur-md">
                                <div className="absolute -right-10 -top-10 size-40 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none transition-all group-hover:bg-indigo-500/20" />
                                <div className="absolute -left-10 -bottom-10 size-40 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />
                                <div className="relative z-10 flex flex-col gap-4 items-start">
                                    <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-zinc-100 text-base font-medium font-sans">Trợ lý AI</h3>
                                        <p className="text-zinc-400 text-sm mt-1.5 font-light leading-relaxed">Gặp khó khăn? Hỏi AI ngay để được giải đáp tức thì mọi lúc mọi nơi.</p>
                                    </div>
                                    <Link
                                        href="/ai/chat"
                                        className="w-full mt-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm backdrop-blur-sm"
                                    >
                                        Chat ngay <ChevronRight className="w-4 h-4 text-zinc-400" />
                                    </Link>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="bg-zinc-900/30 rounded-2xl p-5 border border-white/5 backdrop-blur-md flex flex-col gap-2">
                                <h3 className="text-zinc-100 text-sm font-medium mb-2 pl-2">Khám phá nhanh</h3>
                                {[
                                    { label: 'Khóa học', href: '/courses', icon: BookOpen },
                                    { label: 'Lộ trình', href: '/roadmap', icon: TrendingUp },
                                    { label: 'Xếp hạng', href: '/leaderboard', icon: Trophy },
                                ].map(({ label, href, icon: Icon }) => (
                                    <Link key={href} href={href} className="flex items-center gap-3 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 px-4 py-3 rounded-xl transition-all group">
                                        <Icon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                                        {label}
                                        <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500" />
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
