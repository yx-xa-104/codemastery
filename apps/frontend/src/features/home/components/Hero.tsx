"use client";

import Link from "next/link";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

const headlineWords = ["Khám", "Phá", "Tri", "Thức"];

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
                        {/* Word-by-word staggered entrance */}
                        {headlineWords.map((word, i) => (
                            <motion.span
                                key={word}
                                className="inline-block mr-[0.3em]"
                                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.15 + i * 0.12,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                {word}
                            </motion.span>
                        ))}
                        <br />
                        {/* "Lập Trình" — scale-in with gradient */}
                        <motion.span
                            className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-amber-500 my-2"
                            initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            transition={{
                                duration: 0.8,
                                delay: 0.75,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            Lập Trình
                            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent bg-size-[200%_100%] bg-clip-text animate-shimmer pointer-events-none" aria-hidden="true" />
                        </motion.span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 1.1, ease: "easeOut" }}
                    >
                        Hơn 50+ khóa học từ cơ bản đến nâng cao, AI Tutor hỗ trợ 24/7. Nâng cao kỹ năng coding mỗi ngày với giao diện đẳng cấp.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
                    >
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1"
                        >
                            Bắt đầu học ngay
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/roadmap"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-700/50 bg-navy-900/50 backdrop-blur-md text-slate-300 hover:text-white hover:border-slate-500 hover:bg-white/10 font-bold text-base transition-all"
                        >
                            Xem lộ trình
                        </Link>
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    {[
                        { icon: Code2, label: "Khóa học", value: "50+" },
                        { icon: Zap, label: "Bài thực hành", value: "500+" },
                        { icon: Sparkles, label: "Học viên", value: "1000+" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            className="text-center p-6 rounded-2xl bg-white/2 border border-white/5 backdrop-blur-sm"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.7 + i * 0.15, ease: "easeOut" }}
                            whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
                        >
                            <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-3" />
                            <div className="text-3xl font-black text-white tracking-tight">{stat.value}</div>
                            <div className="text-sm text-slate-400 mt-1 uppercase tracking-wider font-semibold">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
