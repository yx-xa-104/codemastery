import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { Trophy } from "lucide-react";
import { LeaderboardList } from "@/features/leaderboard/components/LeaderboardList";

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

export default async function LeaderboardPage() {
    const leaders = await getLeaderboard();

    return (
        <MainLayout>
            <section className="max-w-4xl mx-auto px-4 py-16 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center gap-2 mb-6 bg-zinc-800/50 border border-white/5 backdrop-blur-sm px-5 py-2 rounded-full">
                        <Trophy className="w-4 h-4 text-zinc-400" />
                        <h1 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">Bảng Xếp Hạng</h1>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5">Danh dự Vàng</h2>
                    <p className="text-zinc-400 text-lg max-w-xl mx-auto font-normal">Nơi vinh danh những kỹ sư phần mềm nỗ lực không ngừng nghỉ. Mỗi bài học hoàn thành là một bệ phóng.</p>
                </div>

                <LeaderboardList leaders={leaders} />
            </section>
        </MainLayout>
    );
}
