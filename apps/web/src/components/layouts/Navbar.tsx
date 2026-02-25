"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Code2, BookOpen, Compass, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Khóa học", href: "/courses", icon: BookOpen },
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
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-glow-indigo transition-transform group-hover:scale-105">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white dark:text-white tracking-tight">
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
                        <Link
                            href="/login"
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-glow-indigo hover:-translate-y-0.5"
                        >
                            Bắt đầu ngay
                        </Link>
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
                                <Link href="/login" className="w-full text-center py-3 text-slate-400 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-colors text-sm">
                                    Đăng nhập
                                </Link>
                                <Link href="/register" className="w-full text-center py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-glow-indigo transition-colors text-sm">
                                    Bắt đầu ngay
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
