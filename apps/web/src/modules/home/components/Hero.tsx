import Link from "next/link";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-navy-950 pt-12 pb-20 sm:pt-16 sm:pb-28">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-6">
                        <Sparkles className="w-4 h-4" />
                        Nền tảng học lập trình #1 Việt Nam
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                        Khám Phá Tri Thức{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-500">
                            Lập Trình
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Hơn 50+ khóa học từ cơ bản đến nâng cao, AI Tutor hỗ trợ 24/7. Nâng cao kỹ năng coding mỗi ngày.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-glow-indigo hover:-translate-y-0.5"
                        >
                            Bắt đầu học ngay
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/roadmap"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-white/5 font-medium text-base transition-all"
                        >
                            Xem lộ trình
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    {[
                        { icon: Code2, label: "Khóa học", value: "50+" },
                        { icon: Zap, label: "Bài thực hành", value: "500+" },
                        { icon: Sparkles, label: "Học viên", value: "10K+" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center p-4 rounded-xl bg-white/[0.03] border border-slate-800/60">
                            <stat.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
