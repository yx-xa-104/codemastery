import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { Trophy, Flame, Medal, Crown, Star } from "lucide-react";
import { cookies } from "next/headers";

interface LeaderboardUser {
    rank: number;
    id: string;
    full_name: string;
    avatar_url: string | null;
    xp: number;
    streak_days: number;
}

async function getLeaderboard(): Promise<LeaderboardUser[]> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    try {
        const res = await fetch(`${API_URL}/api/gamification/leaderboard?limit=20`, {
            cache: 'no-store',
        });
        if (res.ok) return await res.json();
    } catch (err) {
        console.error("Failed to fetch leaderboard", err);
    }
    return [];
}

const rankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-slate-500">{rank}</span>;
};

const rankBg = (rank: number) => {
    if (rank === 1) return "bg-amber-500/5 border-amber-500/20";
    if (rank === 2) return "bg-slate-400/5 border-slate-400/20";
    if (rank === 3) return "bg-amber-700/5 border-amber-700/20";
    return "bg-[#0B1120] border-slate-800";
};

export default async function LeaderboardPage() {
    const leaders = await getLeaderboard();

    return (
        <MainLayout>
            <section className="max-w-3xl mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Trophy className="w-7 h-7 text-amber-500" />
                        <h1 className="text-3xl font-bold text-white">Bảng Xếp Hạng</h1>
                    </div>
                    <p className="text-slate-400 text-sm">Top học viên theo điểm XP tích lũy</p>
                </div>

                {leaders.length === 0 ? (
                    <div className="text-center py-20">
                        <Star className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-400 mb-2">Chưa có dữ liệu xếp hạng</p>
                        <p className="text-sm text-slate-500">Hãy hoàn thành bài học để tích lũy XP!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {leaders.map((leader) => (
                            <div
                                key={leader.id}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors hover:border-indigo-500/30 ${rankBg(leader.rank)}`}
                            >
                                <div className="w-8 flex items-center justify-center">
                                    {rankBadge(leader.rank)}
                                </div>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {leader.avatar_url ? (
                                        <img src={leader.avatar_url} alt="" className="w-9 h-9 rounded-full border-2 border-indigo-500/30" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 text-sm font-bold border-2 border-indigo-500/30">
                                            {leader.full_name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-white truncate">{leader.full_name || 'Ẩn danh'}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-sm">
                                        <Flame className="w-4 h-4 text-orange-400" />
                                        <span className="text-slate-300 font-medium">{leader.streak_days}</span>
                                    </div>
                                    <div className="min-w-[70px] text-right">
                                        <span className="text-sm font-bold text-amber-400">{leader.xp.toLocaleString()} XP</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </MainLayout>
    );
}
