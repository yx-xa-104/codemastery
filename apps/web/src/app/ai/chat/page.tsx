"use client";

import { MainLayout } from "@/components/layouts/MainLayout";
import { AiChatDrawer } from "@/components/features/ai/AiChatDrawer";
import { useState } from "react";
import { Bot, Sparkles, Code2, BookOpen, Zap, MessageSquare } from "lucide-react";

const SUGGESTIONS = [
    "Giải thích closure trong JavaScript là gì?",
    "Tại sao React re-render khi state thay đổi?",
    "Cách tối ưu query SQL với index?",
    "Sự khác biệt giữa async/await và Promise?",
    "Flexbox vs Grid: khi nào dùng cái nào?",
    "Giúp tôi hiểu về Big O notation",
];

export default function AiChatPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <MainLayout>
            <div className="min-h-[calc(100vh-4rem)] bg-[#010816] flex flex-col">
                {/* Hero */}
                <div className="text-center pt-16 pb-10 px-4 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.12),transparent_70%)] pointer-events-none" />
                    <div className="relative">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-medium mb-6">
                            <Sparkles className="w-3 h-3" /> Powered by Gemini AI
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                            Trợ lý <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-amber-400">AI</span> của bạn
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                            Hỏi bất cứ điều gì về lập trình — giải thích khái niệm, debug code, gợi ý giải thuật. AI sẵn sàng giúp bạn 24/7.
                        </p>
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] text-sm"
                        >
                            <Bot className="w-5 h-5" /> Bắt đầu chat với AI
                        </button>
                    </div>
                </div>

                {/* Feature cards */}
                <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                    {[
                        { icon: Code2, title: "Debug Code", desc: "Paste code của bạn và AI sẽ phân tích lỗi, đề xuất cách sửa" },
                        { icon: BookOpen, title: "Giải thích khái niệm", desc: "Từ cơ bản như biến, vòng lặp đến nâng cao như design patterns" },
                        { icon: Zap, title: "Gợi ý giải thuật", desc: "Hỏi về cách tiếp cận tốt nhất cho bài toán lập trình của bạn" },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="bg-[#0B1120] border border-indigo-900/30 rounded-xl p-5 text-center">
                            <div className="size-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                                <Icon className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-white text-sm mb-1.5">{title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>

                {/* Suggested prompts */}
                <div className="max-w-4xl mx-auto px-4 mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <h2 className="text-sm font-bold text-slate-300">Câu hỏi phổ biến</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {SUGGESTIONS.map(s => (
                            <button
                                key={s}
                                onClick={() => setDrawerOpen(true)}
                                className="text-left text-sm text-slate-400 hover:text-white bg-[#0B1120] border border-indigo-900/30 hover:border-indigo-500/40 rounded-xl px-4 py-3 transition-all group"
                            >
                                <span className="text-indigo-500 mr-2 group-hover:text-amber-400 transition-colors">✦</span>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Chat Drawer */}
            <AiChatDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </MainLayout>
    );
}
