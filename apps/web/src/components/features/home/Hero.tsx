"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, Sparkles, TerminalSquare } from "lucide-react";

export function Hero() {
    return (
        <div className="relative overflow-hidden pt-20 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30 font-medium text-sm text-indigo-300">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>Nền tảng học lập trình thế hệ mới 2026</span>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight"
                    >
                        Làm chủ công nghệ <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
                            kiến tạo tương lai
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Học lập trình thực chiến thông qua các dự án đa dạng, biên dịch code trực tiếp trên trình duyệt và nhận sự hỗ trợ 24/7 từ AI Tutor độc quyền.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/courses"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-glow-indigo flex items-center justify-center gap-2 group"
                        >
                            <TerminalSquare className="w-5 h-5" />
                            Bắt đầu học ngay
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/roadmap"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl glass hover:bg-white/5 text-white font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-indigo-500/50"
                        >
                            <Code2 className="w-5 h-5 text-indigo-400" />
                            Xem lộ trình
                        </Link>
                    </motion.div>
                </div>

                {/* Floating elements visualization */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-20 relative mx-auto max-w-5xl"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-amber-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                    <div className="relative rounded-2xl bg-navy-950/80 glass border border-slate-700/50 overflow-hidden shadow-2xl">
                        <div className="h-10 bg-navy-900 border-b border-white/10 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            <div className="ml-4 text-xs font-mono text-slate-500">app/page.tsx - CodeMastery</div>
                        </div>
                        <div className="p-6 font-mono text-sm md:text-base text-slate-300 leading-relaxed overflow-x-auto">
                            <span className="text-purple-400">const</span> <span className="text-blue-400">developer</span> = {'{'}
                            <br />
                            &nbsp;&nbsp;skills: [<span className="text-amber-300">'React'</span>, <span className="text-amber-300">'Next.js'</span>, <span className="text-amber-300">'TypeScript'</span>],
                            <br />
                            &nbsp;&nbsp;platform: <span className="text-green-400">CodeMastery</span >,
                            <br />
                            &nbsp;&nbsp;<span className="text-blue-400">levelUp</span>: <span className="text-purple-400">async</span> () <span className="text-purple-400">=&gt;</span> {'{'}
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">await</span> developer.<span className="text-blue-400">learn</span>(<span className="text-amber-300">'Advanced Concepts'</span>);
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-amber-300">'Mastery Achieved'</span>;
                            <br />
                            &nbsp;&nbsp;{'}'}
                            <br />
                            {'}'};
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
