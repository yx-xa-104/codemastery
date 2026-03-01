"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Code2, BookOpen, Compass, Trophy, LogOut, User, Settings, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useUser } from "@/components/providers/AuthProvider";
import { signOut } from "@/app/auth/actions";

export function Navbar() {
    const pathname = usePathname();
    const { user, loading } = useUser();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close user menu on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navLinks = [
        { name: "Khóa học", href: "/courses", icon: BookOpen },
        { name: "Lộ trình", href: "/roadmap", icon: Compass },
        { name: "Xếp hạng", href: "/leaderboard", icon: Trophy },
    ];

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const avatarUrl = user?.user_metadata?.avatar_url;
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 py-2 transition-colors duration-300 ${isScrolled
                ? "glass-nav shadow-lg"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-glow-indigo transition-transform group-hover:scale-105">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">
                            Code<span className="text-amber-500">Mastery</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname.startsWith(link.href);
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? "text-white bg-white/10"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" />
                                        {link.name}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-500 rounded-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side: Theme + Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />

                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
                        ) : user ? (
                            /* Logged-in: Avatar + Dropdown */
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                                >
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full border-2 border-indigo-500/50" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-bold border-2 border-indigo-500/50">
                                            {initials}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-slate-300 max-w-[120px] truncate hidden lg:block">
                                        {displayName}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-56 rounded-xl bg-gray-900 border border-slate-800 shadow-2xl overflow-hidden z-50"
                                        >
                                            <div className="p-3 border-b border-slate-800">
                                                <p className="text-sm font-medium text-white truncate">{displayName}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                            <div className="p-1">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href="/account/settings"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                                >
                                                    <Settings className="w-4 h-4 text-slate-400" />
                                                    Cài đặt
                                                </Link>
                                                <Link
                                                    href="/account/profile"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                                >
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    Hồ sơ
                                                </Link>
                                            </div>
                                            <div className="p-1 border-t border-slate-800">
                                                <form action={signOut}>
                                                    <button
                                                        type="submit"
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Đăng xuất
                                                    </button>
                                                </form>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* Not logged-in: Login + Register buttons */
                            <>
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-glow-indigo hover:-translate-y-0.5"
                                >
                                    Bắt đầu ngay
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile: Theme + Menu */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-nav overflow-hidden border-t border-border"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            {navLinks.map((link) => {
                                const isActive = pathname.startsWith(link.href);
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-indigo-500/15 text-indigo-400"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <div className="pt-4 mt-3 border-t border-border flex flex-col gap-2">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-bold">
                                                    {initials}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-white">{displayName}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white">
                                            <LayoutDashboard className="w-5 h-5" /> Dashboard
                                        </Link>
                                        <form action={signOut}>
                                            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10">
                                                <LogOut className="w-5 h-5" /> Đăng xuất
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 text-slate-400 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-colors text-sm">
                                            Đăng nhập
                                        </Link>
                                        <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-glow-indigo transition-colors text-sm">
                                            Bắt đầu ngay
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
