"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/shared/stores/useAuthStore";
import {
    LayoutDashboard, Users, BarChart2, Settings, Shield, BookOpen, LogOut
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { signOut } from "@/features/auth/actions";
import { NotificationBell } from "@/shared/components/NotificationBell";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";

const NAV_ITEMS = [
    { label: 'Tổng quan', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Khóa học', href: '/admin/courses', icon: BookOpen },
    { label: 'Tài khoản', href: '/admin/users', icon: Users },
    { label: 'Báo cáo', href: '/admin/reports', icon: BarChart2 },
    { label: 'Cài đặt', href: '/admin/settings', icon: Settings },
];

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export function AdminLayout({ children, title, subtitle, action }: AdminLayoutProps) {
    const pathname = usePathname();
    const { user } = useUser();

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin';
    const avatarUrl = user?.user_metadata?.avatar_url;
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <div className="flex h-screen bg-navy-950 text-slate-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-60 bg-navy-900 border-r border-indigo-900/30 flex-col hidden md:flex shrink-0">
                <div className="h-16 flex items-center px-5 border-b border-indigo-900/30 gap-2">
                    <Link href="/" className="text-xl font-bold tracking-tighter text-white">
                        Code<span className="text-indigo-500">Mastery</span>
                    </Link>
                    <span className="text-[10px] uppercase tracking-wide bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">Admin</span>
                </div>

                <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
                    {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
                        return (
                            <Link key={label} href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                                    : 'text-slate-400 hover:bg-navy-800 hover:text-white border border-transparent'
                                    }`}>
                                <Icon className="w-4 h-4 shrink-0" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-indigo-900/30">
                    <div className="flex items-center gap-3 px-2">
                        {avatarUrl ? (
                            <img src={avatarUrl} className="size-9 rounded-full border border-red-500/50 object-cover shrink-0" alt="" />
                        ) : (
                            <div className="size-9 rounded-full bg-linear-to-tr from-red-500 to-orange-400 p-[2px] shrink-0">
                                <div className="size-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">{initials}</div>
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{displayName}</p>
                            <p className="text-xs text-slate-500">Quản trị viên</p>
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
                <header className="h-16 bg-navy-900/80 backdrop-blur-md border-b border-indigo-900/30 flex items-center justify-between px-6 z-20 shrink-0">
                    <div className="flex-1 max-w-lg hidden md:block">
                        <input
                            className="block w-full pl-4 pr-4 py-2 border border-slate-700 rounded-full bg-navy-950 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                            placeholder="Tìm kiếm tài khoản..."
                        />
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                        <ThemeToggle />
                        <NotificationBell />
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-medium text-red-300">
                            <Shield className="w-3.5 h-3.5" /> Admin Panel
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-navy-950">
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
