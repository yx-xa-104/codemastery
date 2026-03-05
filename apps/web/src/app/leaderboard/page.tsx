import { MainLayout } from "@/components/layouts/MainLayout";
import { createClient } from "@/lib/supabase/server";
import { Trophy, Medal, Star, TrendingUp, Flame } from "lucide-react";

const MOCK_LEADERS = [
    { rank: 1, name: "Nguyễn Văn Minh", score: 15840, streak: 42, courses: 8, badge: "🏆", avatar: "M" },
    { rank: 2, name: "Lê Thị Hoa", score: 14200, streak: 35, courses: 7, badge: "🥈", avatar: "H" },
    { rank: 3, name: "Trần Đức Anh", score: 12500, streak: 28, courses: 6, badge: "🥉", avatar: "A" },
    { rank: 4, name: "Phạm Thị Lan", score: 9800, streak: 21, courses: 5, badge: null, avatar: "L" },
    { rank: 5, name: "Hoàng Nam", score: 8750, streak: 18, courses: 4, badge: null, avatar: "N" },
    { rank: 6, name: "Đỗ Hiếu", score: 7200, streak: 14, courses: 4, badge: null, avatar: "H" },
    { rank: 7, name: "Bùi Thị Mai", score: 6400, streak: 10, courses: 3, badge: null, avatar: "M" },
    { rank: 8, name: "Vũ Quốc Dũng", score: 5900, streak: 8, courses: 3, badge: null, avatar: "D" },
];

const RANK_COLORS = [
    "from-amber-500 to-yellow-400",
    "from-slate-400 to-slate-300",
    "from-amber-700 to-amber-600",
];

export default async function LeaderboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const top3 = MOCK_LEADERS.slice(0, 3);
    const rest = MOCK_LEADERS.slice(3);

    return (
        <MainLayout>
            <div className="min-h-screen bg-[#010816]">
                {/* Hero */}
                <div className="text-center py-14 px-4 border-b border-indigo-900/30 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_70%)] pointer-events-none" />
                    <div className="relative">
                        <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                            Bảng <span className="text-amber-400">Xếp hạng</span>
                        </h1>
                        <p className="text-slate-400 text-base max-w-xl mx-auto">
                            Top học viên xuất sắc nhất tuần này. Nỗ lực mỗi ngày để leo lên vị trí cao hơn!
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-10">
                    {/* Top 3 podium */}
                    <div className="flex items-end justify-center gap-4 mb-10">
                        {[top3[1], top3[0], top3[2]].map((leader, i) => {
                            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
                            const heights = ["h-32", "h-40", "h-28"];
                            const gradients = [RANK_COLORS[1], RANK_COLORS[0], RANK_COLORS[2]];
                            return (
                                <div key={leader.rank} className={`flex flex-col items-center ${i === 1 ? 'scale-110' : ''}`}>
                                    <span className="text-2xl mb-1">{leader.badge}</span>
                                    <div className={`size-14 rounded-full bg-linear-to-br ${gradients[i]} flex items-center justify-center text-white font-bold text-lg border-2 border-white/20 mb-2`}>
                                        {leader.avatar}
                                    </div>
                                    <p className="text-xs text-white font-medium text-center max-w-[80px] truncate">{leader.name.split(' ').slice(-1)[0]}</p>
                                    <p className="text-[10px] text-amber-400 font-bold">{leader.score.toLocaleString()} pts</p>
                                    <div className={`${heights[i]} w-20 bg-linear-to-b ${gradients[i]} rounded-t-xl mt-2 opacity-30`} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Full ranking table */}
                    <div className="bg-[#0B1120] border border-indigo-900/30 rounded-2xl overflow-hidden">
                        <div className="border-b border-indigo-900/30 px-5 py-3 flex gap-2">
                            {['Tuần này', 'Tháng này', 'Mọi thời đại'].map((t, i) => (
                                <button key={t} className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${i === 0 ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-500 hover:text-white'}`}>{t}</button>
                            ))}
                        </div>
                        <div className="divide-y divide-indigo-900/20">
                            {MOCK_LEADERS.map(leader => {
                                const isMe = false; // TODO: compare with user id
                                return (
                                    <div key={leader.rank} className={`flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors ${isMe ? 'bg-indigo-600/5 border-l-2 border-indigo-500' : ''}`}>
                                        <span className={`w-7 text-center text-sm font-bold shrink-0 ${leader.rank <= 3 ? 'text-amber-400' : 'text-slate-500'}`}>
                                            {leader.rank <= 3 ? leader.badge : `#${leader.rank}`}
                                        </span>
                                        <div className="size-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                                            {leader.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{leader.name}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0">
                                            <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" /> {leader.streak}</span>
                                            <span className="font-bold text-amber-400">{leader.score.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Your ranking CTA */}
                    {!user && (
                        <div className="mt-6 text-center bg-[#0B1120] border border-indigo-900/30 rounded-xl p-6">
                            <p className="text-slate-400 text-sm mb-3">Đăng nhập để xem thứ hạng của bạn</p>
                            <a href="/auth/login" className="inline-flex px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">Đăng nhập ngay</a>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
