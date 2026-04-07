"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, Trophy, Code2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { NotificationBell } from "@/shared/components/NotificationBell";
import { useUser } from "@/shared/stores/useAuthStore";
import { Button } from "@/shared/components/ui/button";

// Extracted Sub-Components
import { UserDropdown } from "./navbar/UserDropdown";

export function Navbar() {
    const pathname = usePathname();
    const { user, role, loading } = useUser();
    const [isScrolled, setIsScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
        { name: "Luyện tập", href: "/practice", icon: Code2 },
        { name: "Lộ trình", href: "/roadmap", icon: Compass },
        { name: "Xếp hạng", href: "/leaderboard", icon: Trophy },
    ];

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
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="size-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-900/20 group-hover:bg-indigo-500/20 transition-all">
                            <Code2 className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-100 transition-colors">
                            Code<span className="text-indigo-500">Mastery</span>
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

                    {/* Right side: Search + Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        <button 
                            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-400 text-xs font-medium mr-2 group/cmd"
                        >
                            <span className="group-hover/cmd:text-slate-300">Tìm kiếm...</span>
                            <kbd className="px-1.5 py-0.5 rounded-md bg-black/40 border border-white/10 text-[10px] font-mono text-slate-400">⌘K</kbd>
                        </button>

                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
                        ) : user ? (
                            <>
                                <NotificationBell />
                                <UserDropdown 
                                    user={user} 
                                    role={role} 
                                    userMenuOpen={userMenuOpen} 
                                    setUserMenuOpen={setUserMenuOpen}
                                    userMenuRef={userMenuRef} 
                                />
                            </>
                        ) : (
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

                </div>
            </div>
        </nav>
    );
}
