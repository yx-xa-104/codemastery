"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/shared/stores/useAuthStore";
import {
    LayoutDashboard, BookOpen, Users, BarChart2,
    MessageSquare, Settings, BookMarked, Plus, LogOut
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { signOut } from "@/features/auth/actions";
import { NotificationBell } from "@/shared/components/NotificationBell";
import { createClient } from "@/shared/lib/supabase/client";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
    { label: 'Tổng quan', href: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'Khóa học', href: '/teacher/courses', icon: BookOpen },
    { label: 'Bài tập', href: '/teacher/exercises', icon: BookMarked },
    { label: 'Tin nhắn', href: '/teacher/messages', icon: MessageSquare },
    { label: 'Cài đặt', href: '/teacher/settings', icon: Settings },
];

interface TeacherLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export function TeacherLayout({ children, title, subtitle, action }: TeacherLayoutProps) {
    const pathname = usePathname();
    const { user } = useUser();

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Giảng viên';
    const avatarUrl = user?.user_metadata?.avatar_url;
    const initials = displayName.charAt(0).toUpperCase();

    const [unreadMessages, setUnreadMessages] = useState<number>(0);

    // Fetch initial unread count
    useEffect(() => {
        if (!user) return;
        const supabase = createClient();

        const fetchUnread = async () => {
            const { count } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false)
                .like('link_url', '%/teacher/messages%');
            
            if (count !== null) setUnreadMessages(count);
        };
        
        fetchUnread();

        const channel = supabase
            .channel(`public:notifications_${user.id}_layout`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => {
                fetchUnread();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Clear unread when visiting the messages page
    useEffect(() => {
        if (pathname === '/teacher/messages' && unreadMessages > 0 && user) {
            setUnreadMessages(0);
            const clearUnread = async () => {
                const supabase = createClient();
                await (supabase as any).from('notifications')
                    .update({ is_read: true })
                    .eq('user_id', user.id)
                    .eq('is_read', false)
                    .like('link_url', '%/teacher/messages%');
            };
            clearUnread();
        }
    }, [pathname, unreadMessages, user]);

    return (
        <div className="flex h-screen bg-[#010816] text-slate-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-60 bg-[#0B1120] border-r border-indigo-900/30 flex-col hidden md:flex shrink-0">
                <div className="h-16 flex items-center px-5 border-b border-indigo-900/30 gap-2">
                    <Link href="/" className="text-xl font-bold tracking-tighter text-white font-heading">
                        Code<span className="text-indigo-500">Mastery</span>
                    </Link>
                    <span className="text-[10px] uppercase tracking-wide bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">Teacher</span>
                </div>

                <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
                    {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href || (href !== '/teacher/dashboard' && pathname.startsWith(href));
                        const showDot = label === 'Tin nhắn' && unreadMessages > 0;
                        
                        return (
                            <Link key={label} href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                                    }`}>
                                <Icon className="w-4 h-4 shrink-0" />
                                {label}
                                {showDot && <span className="ml-auto w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-indigo-900/30">
                    <div className="flex items-center gap-3 px-2">
                        {avatarUrl ? (
                            <img src={avatarUrl} className="size-9 rounded-full border border-amber-500/50 object-cover shrink-0" alt="" />
                        ) : (
                            <div className="size-9 rounded-full bg-linear-to-tr from-amber-500 to-yellow-300 p-[2px] shrink-0">
                                <div className="size-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">{initials}</div>
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{displayName}</p>
                            <p className="text-xs text-slate-500">Giảng viên</p>
                        </div>
                        <button onClick={() => signOut()} title="Đăng xuất"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col h-full min-w-0">
                {/* Header */}
                <header className="h-16 bg-[#0B1120]/80 backdrop-blur-md border-b border-indigo-900/30 flex items-center justify-between px-6 z-20 shrink-0">
                    <div className="flex-1 max-w-lg hidden md:block">
                        <input
                            className="block w-full pl-4 pr-4 py-2 border border-slate-700 rounded-full bg-[#010816] text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                            placeholder="Tìm kiếm..."
                        />
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                        <NotificationBell />
                        <Link href="/teacher/courses/create"
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-full transition-all shadow-md shrink-0">
                            <Plus className="w-4 h-4" /> Tạo khóa học
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-[#010816]">
                    {(title || action) && (
                        <div className="px-6 lg:px-8 pt-8 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
                                {subtitle && <p className="text-indigo-300 text-sm mt-1">{subtitle}</p>}
                            </div>
                            {action && <div className="shrink-0">{action}</div>}
                        </div>
                    )}
                    <div className="px-6 lg:px-8 py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
