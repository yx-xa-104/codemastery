"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Compass, Trophy, Code2, Home } from "lucide-react";

type CommandItem = {
    id: string;
    title: string;
    icon: React.ElementType;
    href: string;
    category: string;
};

const COMMANDS: CommandItem[] = [
    { id: "home", title: "Trang chủ", icon: Home, href: "/", category: "Điều hướng" },
    { id: "courses", title: "Danh sách Khóa học", icon: BookOpen, href: "/courses", category: "Điều hướng" },
    { id: "practice", title: "Luyện tập Code", icon: Code2, href: "/practice", category: "Điều hướng" },
    { id: "roadmap", title: "Lộ trình học", icon: Compass, href: "/roadmap", category: "Điều hướng" },
    { id: "leaderboard", title: "Bảng xếp hạng", icon: Trophy, href: "/leaderboard", category: "Điều hướng" },
];

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const filteredCommands = COMMANDS.filter((command) =>
        command.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    useEffect(() => {
        if (!open) setSearch("");
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            }
            if (e.key === "Enter") {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    setOpen(false);
                    router.push(filteredCommands[selectedIndex].href);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, filteredCommands, selectedIndex, router]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                    <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="w-full max-w-xl bg-navy-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
                        >
                            <div className="flex items-center px-4 border-b border-white/10">
                                <Search className="w-5 h-5 text-slate-400" />
                                <input
                                    autoFocus
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Tìm kiếm khoá học, bài học, phím tắt..."
                                    className="w-full bg-transparent border-none text-slate-200 px-3 py-4 focus:outline-none placeholder:text-slate-500 text-base"
                                />
                                <kbd className="hidden sm:inline-flex px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">ESC</kbd>
                            </div>
                            
                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {filteredCommands.length === 0 ? (
                                    <div className="text-center py-10 text-sm text-slate-500">
                                        Không tìm thấy dữ liệu.
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        <div className="px-3 md:px-4 py-2 text-xs font-semibold text-slate-500">
                                            {filteredCommands[0]?.category}
                                        </div>
                                        {filteredCommands.map((command, idx) => {
                                            const Icon = command.icon;
                                            const isSelected = selectedIndex === idx;
                                            return (
                                                <button
                                                    key={command.id}
                                                    onClick={() => {
                                                        setOpen(false);
                                                        router.push(command.href);
                                                    }}
                                                    onMouseEnter={() => setSelectedIndex(idx)}
                                                    className={`flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl transition-all w-full text-left ${isSelected
                                                        ? "bg-indigo-500/15 text-indigo-300"
                                                        : "text-slate-300 hover:bg-white/5"
                                                        }`}
                                                >
                                                    <div className={`p-1.5 rounded-lg border ${isSelected ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-medium text-sm flex-1">{command.title}</span>
                                                    {isSelected && (
                                                        <span className="text-xs text-indigo-400/50">⏎ Nhấn Enter</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
