import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { MainLayout } from "@/shared/components/layouts/MainLayout";
import Link from "next/link";
import {
    User, Mail, Shield, Camera, BookOpen, Award, TrendingUp, Calendar, Zap, Flame, Trophy
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const TABS = [
    { id: "profile", label: "Hồ sơ cá nhân", icon: User, href: "/dashboard/profile" },
    { id: "settings", label: "Cài đặt", icon: Shield, href: "/dashboard/settings" },
];

export default async function DashboardProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const authHeaders: Record<string, string> = {};
    if (accessToken) {
        authHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    let profileData: any = null;
    try {
        const profileRes = await fetch(`${API_URL}/api/profile`, {
            headers: authHeaders,
            cache: 'no-store'
        });
        if (profileRes.ok) profileData = await profileRes.json();
    } catch (err) {
        console.error("Failed to fetch profile", err);
    }

    const displayName = profileData?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Học viên';
    const avatarUrl = profileData?.avatar_url || user.user_metadata?.avatar_url;
    const initials = displayName.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase();
    const email = user.email ?? '';
    const joinDate = new Date(user.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' });
    const studentId = profileData?.student_id || user.id.slice(0, 8).toUpperCase();
    const dateOfBirth = profileData?.date_of_birth || '';
    const gender = profileData?.gender || '';
    const role = profileData?.role || 'student';

    const genderLabel = gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : gender === 'other' ? 'Khác' : '';

    type EnrollRow = { progress_percent: number | null; courses: { title: string; slug: string; thumbnail_url: string | null; level: string } | null };
    let typedEnrollments: EnrollRow[] = [];
    let enrollCount = 0;
    try {
        const res = await fetch(`${API_URL}/api/enrollments`, {
            headers: authHeaders,
            cache: 'no-store'
        });
        if (res.ok) {
            const data = await res.json();
            enrollCount = data.length;
            typedEnrollments = data.slice(0, 4);
        }
    } catch (err) {
        console.error("Failed to fetch enrollments", err);
    }

    // Fetch gamification stats
    type GamStats = { xp: number; streak_days: number; rank: number };
    let gamStats: GamStats = { xp: 0, streak_days: 0, rank: 0 };
    try {
        const res = await fetch(`${API_URL}/api/gamification/my-stats`, {
            headers: authHeaders, cache: 'no-store'
        });
        if (res.ok) gamStats = await res.json();
    } catch { /* no stats */ }

    // Fetch badges
    type BadgeRow = { id: string; name: string; description: string; icon: string; criteria_type: string; criteria_value: number };
    type UserBadge = { badge_id: string; earned_at: string; badges: BadgeRow };
    let allBadges: BadgeRow[] = [];
    let myBadges: UserBadge[] = [];
    try {
        const [resBadges, resMyBadges] = await Promise.all([
            fetch(`${API_URL}/api/gamification/badges`, { cache: 'no-store' }),
            fetch(`${API_URL}/api/gamification/my-badges`, { headers: authHeaders, cache: 'no-store' }),
        ]);
        if (resBadges.ok) allBadges = await resBadges.json();
        if (resMyBadges.ok) myBadges = await resMyBadges.json();
    } catch { /* badges fetch failed */ }
    const earnedBadgeIds = myBadges.map(b => b.badge_id);

    const avgProgress = typedEnrollments.length > 0
        ? Math.round(typedEnrollments.reduce((sum, e) => sum + (e.progress_percent ?? 0), 0) / typedEnrollments.length)
        : 0;

    return (
        <MainLayout>
            <div className="min-h-screen relative z-10 py-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tab bar */}
                    <div className="flex gap-2 mb-8 border-b border-slate-800">
                        {TABS.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <Link key={tab.id} href={tab.href}
                                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab.id === 'profile'
                                        ? 'text-indigo-400 border-indigo-500'
                                        : 'text-slate-400 border-transparent hover:text-white'}`}>
                                    <Icon className="w-4 h-4" /> {tab.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile card */}
                        <div className="bg-navy-900 border border-indigo-900/30 rounded-2xl p-6 h-fit">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="relative group mb-4">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} className="size-24 rounded-full object-cover border-2 border-indigo-500/50" alt="" />
                                    ) : (
                                        <div className="size-24 rounded-full bg-linear-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-2xl font-bold text-white">
                                            {initials}
                                        </div>
                                    )}
                                    <Button variant="ghost" className="absolute inset-0 bg-black/50 hover:bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                    </Button>
                                </div>
                                <h2 className="text-lg font-bold text-white">{displayName}</h2>
                                <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                                    <Mail className="w-3.5 h-3.5" /> {email}
                                </p>
                                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                                    <Calendar className="w-3 h-3" /> Tham gia từ {joinDate}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-5">
                                {[
                                    { label: 'XP', value: gamStats.xp.toLocaleString(), icon: Zap },
                                    { label: 'Chuỗi ngày', value: gamStats.streak_days, icon: Flame },
                                    { label: 'Huy hiệu', value: myBadges.length, icon: Award },
                                ].map(({ label, value, icon: Icon }) => (
                                    <div key={label} className="text-center bg-navy-950 rounded-xl p-3 border border-indigo-900/20">
                                        <Icon className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                                        <p className="text-sm font-bold text-white">{value}</p>
                                        <p className="text-[10px] text-slate-500">{label}</p>
                                    </div>
                                ))}
                            </div>

                            <Link href="/dashboard/settings"
                                className="flex items-center gap-2 w-full py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg justify-center transition-colors">
                                <Shield className="w-4 h-4" /> Cài đặt tài khoản
                            </Link>
                        </div>

                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-5">
                            <div className="bg-navy-900 border border-indigo-900/30 rounded-2xl p-6">
                                <h3 className="font-bold text-white mb-5">Thông tin cá nhân</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: 'Họ và tên', value: displayName },
                                        { label: 'Email', value: email },
                                        ...(role === 'student' || !role ? [{ label: 'Mã học viên', value: studentId }] : []),
                                        { label: 'Ngày tham gia', value: joinDate },
                                        ...(dateOfBirth ? [{ label: 'Ngày sinh', value: new Date(dateOfBirth).toLocaleDateString('vi-VN') }] : []),
                                        ...(genderLabel ? [{ label: 'Giới tính', value: genderLabel }] : []),
                                    ].map(({ label, value }) => (
                                        <div key={label}>
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                                            <p className="text-sm text-white font-medium">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-navy-900 border border-indigo-900/30 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="font-bold text-white">Khóa học đang học</h3>
                                    <Link href="/courses" className="text-xs text-indigo-400 hover:text-indigo-300">Xem tất cả →</Link>
                                </div>
                                {typedEnrollments.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 text-sm">
                                        <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-700" />
                                        Bạn chưa đăng ký khóa học nào
                                        <div className="mt-3">
                                            <Link href="/courses" className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors">
                                                Khám phá khóa học
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {typedEnrollments.map((e, i) => {
                                            const course = e.courses;
                                            if (!course) return null;
                                            return (
                                                <Link key={i} href={`/courses/${course.slug}`}
                                                    className="flex items-center gap-4 p-3 bg-navy-950 rounded-xl border border-indigo-900/20 hover:border-indigo-500/30 transition-colors group">
                                                    <div className="size-12 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                                                        {course.thumbnail_url
                                                            ? <img src={course.thumbnail_url} className="w-full h-full object-cover" alt="" />
                                                            : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-5 h-5 text-slate-600" /></div>
                                                        }
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">{course.title}</p>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${e.progress_percent ?? 0}%` }} />
                                                            </div>
                                                            <span className="text-xs text-slate-500 shrink-0">{e.progress_percent ?? 0}%</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Badges Section */}
                            <div className="bg-navy-900 border border-indigo-900/30 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <Award className="w-4 h-4 text-amber-400" />
                                        Huy hiệu ({myBadges.length}/{allBadges.length})
                                    </h3>
                                </div>
                                {allBadges.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 text-sm">
                                        <Award className="w-10 h-10 mx-auto mb-2 text-slate-700" />
                                        Chưa có huy hiệu nào được thiết lập
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {allBadges.map(badge => {
                                            const earned = earnedBadgeIds.includes(badge.id);
                                            return (
                                                <div key={badge.id}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                                                        earned
                                                            ? 'bg-amber-500/5 border-amber-500/20'
                                                            : 'bg-navy-950 border-slate-800/50 opacity-50'
                                                    }`}
                                                >
                                                    <div className={`size-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${
                                                        earned ? 'bg-amber-500/20' : 'bg-slate-800'
                                                    }`}>
                                                        {badge.icon}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`text-sm font-bold truncate ${earned ? 'text-white' : 'text-slate-500'}`}>
                                                            {badge.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500 truncate">{badge.description}</p>
                                                    </div>
                                                    {earned && (
                                                        <div className="ml-auto shrink-0">
                                                            <div className="size-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                                                <span className="text-green-400 text-xs">✓</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
