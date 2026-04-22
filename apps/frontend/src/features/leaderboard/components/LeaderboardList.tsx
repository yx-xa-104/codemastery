"use client";

import { motion } from "framer-motion";
import { Flame, Star } from "lucide-react";

interface LeaderboardUser {
    rank: number;
    id: string;
    full_name: string;
    avatar_url: string | null;
    xp: number;
    streak_days: number;
}

export function LeaderboardList({ leaders }: { leaders: LeaderboardUser[] }) {
    if (leaders.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 bg-zinc-900/30 border border-white/[0.05] rounded-3xl backdrop-blur-xl"
            >
                <Star className="w-12 h-12 text-zinc-600 mx-auto mb-4" strokeWidth={1} />
                <p className="text-zinc-200 font-medium text-lg mb-2">Chưa có dữ liệu xếp hạng</p>
                <p className="text-sm text-zinc-500">Hãy hoàn thành bài học để thiết lập kỷ lục đầu tiên.</p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-2 relative z-10">
            {leaders.map((leader, index) => {
                const isTop3 = leader.rank <= 3;
                return (
                    <motion.div
                        key={leader.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 1.01 }}
                        className={`group flex items-center gap-4 px-5 py-3.5 rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                            leader.rank === 1 ? "bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]" :
                            leader.rank === 2 ? "bg-slate-400/10 border-slate-400/30 hover:bg-slate-400/20 shadow-[0_0_15px_rgba(148,163,184,0.1)]" :
                            leader.rank === 3 ? "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]" :
                            "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 shadow-sm"
                        }`}
                    >
                        <div className="w-10 flex items-center justify-center">
                            <span className={`text-lg font-bold tracking-tighter ${
                                leader.rank === 1 ? "text-amber-500" :
                                leader.rank === 2 ? "text-zinc-300" :
                                leader.rank === 3 ? "text-orange-500" :
                                "text-zinc-600"
                            }`}>
                                {leader.rank < 10 && leader.rank > 0 ? `0${leader.rank}` : leader.rank}
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0">
                            {leader.avatar_url ? (
                                <img src={leader.avatar_url} alt="" className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                            ) : (
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border ${
                                    isTop3 ? "bg-white/5 border-white/10 text-zinc-300" : "bg-black/20 border-white/5 text-zinc-500"
                                }`}>
                                    {leader.full_name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            )}
                            <span className={`text-base font-medium truncate transition-colors duration-300 ${isTop3 ? "text-zinc-100" : "text-zinc-300 group-hover:text-zinc-100"}`}>
                                {leader.full_name || 'Anonymous User'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-1.5 text-sm">
                                <Flame className={`w-4 h-4 ${leader.streak_days > 0 ? "text-orange-500" : "text-zinc-700"}`} strokeWidth={2} />
                                <span className={leader.streak_days > 0 ? "text-zinc-300 font-medium" : "text-zinc-600"}>
                                    {leader.streak_days}
                                </span>
                            </div>
                            <div className="min-w-[80px] text-right">
                                <span className={`text-[15px] font-semibold font-mono tracking-tight ${isTop3 ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}>
                                    {leader.xp.toLocaleString()}<span className="text-zinc-600 font-sans font-normal ml-1 text-xs">XP</span>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
