"use client";

import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, MessageSquare, Code2, BookOpen, Zap, RotateCcw, X, History } from "lucide-react";
import { useAiChat } from "@/features/ai-chat/model/useAiChat";
import { useUser } from "@/shared/stores/useAuthStore";
import { ChatMessage, Message } from "@/features/ai-chat/ui/ChatMessage";

const INITIAL_MESSAGE: Message = {
    id: "init",
    role: "assistant",
    content: "Xin chào! Mình là **AI Tutor** của CodeMastery. 👋\n\nMình có thể giúp bạn:\n- 🔍 Giải thích khái niệm lập trình\n- 🐛 Debug và sửa lỗi code\n- 💡 Gợi ý cách tiếp cận bài toán\n- 📚 Giải đáp thắc mắc về bài học\n\nBạn cần hỗ trợ gì hôm nay?",
};

const SUGGESTIONS = [
    "Closure trong JavaScript là gì?",
    "Tại sao React re-render khi state thay đổi?",
    "Flexbox vs Grid: khi nào dùng cái nào?",
    "Giải thích Big O notation",
];


export default function AiChatPage() {
    const { user } = useUser();
    const { messages, isLoading: isTyping, sendMessage, clearMessages, abortStream, sessions, isSessionsLoading, fetchSessions, loadSession, currentSessionId, deleteSession } = useAiChat(INITIAL_MESSAGE as any);
    const [input, setInput] = useState("");
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (user?.id) {
            fetchSessions(user.id);
        }
    }, [user?.id, fetchSessions]);

    const resetTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '36px';
        }
    };

    const handleSend = async (text?: string) => {
        const content = (text ?? input).trim();
        if (!content || isTyping) return;

        setInput("");
        resetTextarea();

        // Refocus textarea after state update
        setTimeout(() => textareaRef.current?.focus(), 0);

        sendMessage(content, user?.id);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleReset = () => {
        abortStream();
        clearMessages();
        resetTextarea();
        setTimeout(() => textareaRef.current?.focus(), 0);
    };

    return (
        <MainLayout hideAiChat>
            <div className="h-[calc(100vh-64px)] bg-[#010816] flex flex-col lg:flex-row overflow-hidden">

                {/* ── Left sidebar: features & suggestions ── */}
                <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 border-r border-slate-800/60 p-6 gap-6">
                    {/* Branding */}
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-indigo-600 flex items-center justify-center relative shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                            <span className="absolute -top-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-[#010816]" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-sm">AI Tutor</h2>
                            <p className="text-[11px] text-indigo-400 flex items-center gap-1"><Sparkles className="w-3 h-3" /> trực tuyến</p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tính năng</p>
                        {[
                            { icon: Code2, label: "Debug Code", desc: "Phân tích và sửa lỗi" },
                            { icon: BookOpen, label: "Giải thích khái niệm", desc: "Từ cơ bản đến nâng cao" },
                            { icon: Zap, label: "Gợi ý giải thuật", desc: "Cách tiếp cận tối ưu" },
                        ].map(({ icon: Icon, label, desc }) => (
                            <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-[#0B1120] border border-indigo-900/30">
                                <Icon className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-white">{label}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Sessions */}
                    <div className="space-y-2 flex-1 overflow-y-auto scrollbar-none">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between mb-3">
                            <span className="flex items-center gap-1.5"><History className="w-3 h-3" /> Lịch sử chat</span>
                        </p>
                        
                        {isSessionsLoading ? (
                            <p className="text-[11px] text-slate-500 italic text-center py-4">Đang tải...</p>
                        ) : sessions.length === 0 ? (
                            <p className="text-[11px] text-slate-500 italic text-center py-4">Chưa có phiên trò chuyện nào.</p>
                        ) : (
                            sessions.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => loadSession(s.id)}
                                    className={`w-full text-left text-xs text-slate-400 group hover:text-white bg-[#0B1120] border rounded-xl px-3 py-2.5 transition-all outline-none flex items-start justify-between gap-2 ${
                                        currentSessionId === s.id 
                                            ? "border-indigo-500/80 bg-indigo-500/10 text-white" 
                                            : "border-indigo-900/30 hover:border-indigo-500/40 hover:bg-indigo-500/5"
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate font-medium">{s.title}</p>
                                        <p className="text-[9px] text-slate-600 mt-1">{new Date(s.created_at).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div
                                        onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                                        className="shrink-0 opacity-0 group-hover:opacity-100 p-1 text-red-500/70 hover:text-red-400 hover:bg-red-500/20 rounded-md transition-all self-center"
                                        title="Xóa phiên"
                                    >
                                        <X className="w-3 h-3" />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Reset */}
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Bắt đầu cuộc trò chuyện mới
                    </button>
                </aside>

                {/* ── Right: Chat area ── */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    {/* Mobile header */}
                    <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-800/60 bg-[#0B1120]">
                        <div className="size-8 rounded-full bg-indigo-600 flex items-center justify-center relative shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                            <span className="absolute -top-px -right-px size-2.5 bg-green-500 rounded-full border-2 border-[#0B1120]" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-sm">AI Tutor</h2>
                            <p className="text-[10px] text-indigo-400">trực tuyến</p>
                        </div>
                        <button onClick={handleReset} className="ml-auto text-slate-500 hover:text-white transition-colors">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
                        {messages.map((msg, index) => (
                            <ChatMessage
                                key={msg.id}
                                message={msg}
                                isTyping={isTyping}
                                isLast={index === messages.length - 1}
                            />
                        ))}

                        {isTyping && messages[messages.length - 1]?.role !== 'assistant' && (
                            <div className="flex gap-3">
                                <div className="size-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-[#0B1120] border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
                                    <div className="flex gap-1 items-center h-4">
                                        <span className="size-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="size-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="size-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Input bar */}
                    <div className="px-4 pb-4 pt-3 border-t border-slate-800/60 bg-[#010816]">
                        {/* Mobile suggestions */}
                        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
                            {SUGGESTIONS.slice(0, 3).map(s => (
                                <button key={s} onClick={() => handleSend(s)}
                                    disabled={isTyping}
                                    className="shrink-0 text-[11px] text-slate-400 bg-[#0B1120] border border-slate-700 rounded-full px-3 py-1.5 hover:border-indigo-500/50 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="relative flex items-end gap-2 bg-[#0B1120] border border-slate-700 rounded-2xl p-2 focus-within:border-indigo-500 transition-colors">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Nhập câu hỏi về lập trình... (Enter để gửi)"
                                rows={1}
                                className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none max-h-[120px] py-1.5 px-2"
                                style={{ minHeight: '36px' }}
                                onInput={e => {
                                    const el = e.currentTarget;
                                    el.style.height = '36px';
                                    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                                }}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isTyping}
                                className="shrink-0 size-9 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-slate-600 mt-2">
                            AI có thể trả lời sai. Hãy kiểm tra lại thông tin.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
