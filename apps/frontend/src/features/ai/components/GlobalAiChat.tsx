"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, X, Send, Sparkles, Minimize2, ExternalLink } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { ChatMessage } from "@/features/ai-chat/ui/ChatMessage";

const QUICK_PROMPTS = ["Closure là gì?", "Debug lỗi TypeScript", "Giải thích async/await"];

import { useAiChat } from "@/features/ai-chat/model/useAiChat";
import { useUser } from "@/shared/stores/useAuthStore";
import { History, MessageSquarePlus } from "lucide-react";
import { IntelligentLoader } from "@/features/ai-chat/ui/IntelligentLoader";

export function GlobalAiChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [view, setView] = useState<'chat' | 'history'>('chat');
    const { user } = useUser();

    const { messages, isLoading: isTyping, sendMessage, abortStream, clearMessages, sessions, isSessionsLoading, fetchSessions, loadSession, currentSessionId, deleteSession } = useAiChat();

    // Scroll messages container (not window)
    useEffect(() => {
        if (containerRef.current && view === 'chat') {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, view]);

    useEffect(() => {
        if (user?.id && isOpen) {
            fetchSessions(user.id);
        }
    }, [user?.id, isOpen, fetchSessions]);

    const handleOpen = () => {
        setIsOpen(true);
        setIsMinimized(false);
        setTimeout(() => textareaRef.current?.focus(), 150);
    };

    const handleClose = () => setIsOpen(false);
    const handleMinimize = () => setIsMinimized(true);

    const resetTextarea = () => {
        if (textareaRef.current) textareaRef.current.style.height = "36px";
    };

    const handleSend = useCallback(async (text?: string) => {
        const content = (text ?? input).trim();
        if (!content || isTyping) return;

        setInput("");
        resetTextarea();
        setTimeout(() => textareaRef.current?.focus(), 0);

        sendMessage(content, user?.id);
    }, [input, isTyping, sendMessage, user?.id]);

    return (
        <>
            {/* ── FAB Button ── */}
            {!isOpen && (
                <button
                    onClick={handleOpen}
                    aria-label="Mở AI Tutor"
                    className="fixed bottom-6 right-6 z-50 group border-none outline-none bg-transparent p-0 cursor-pointer"
                >
                    {/* Pulse ring */}
                    <span className="absolute inset-0 rounded-full bg-indigo-500 opacity-30 animate-ping" />

                    <span className="relative flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-slate-50 pl-4 pr-5 py-3.5 rounded-full shadow-2xl shadow-indigo-600/40 transition-all duration-200 group-hover:scale-105 group-hover:shadow-indigo-500/50">
                        <Bot className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-semibold tracking-tight">AI Tutor</span>
                        {/* Online dot */}
                        <span className="absolute -top-0.5 -right-0.5 size-3.5 bg-green-500 rounded-full border-2 border-[#010816]" />
                    </span>
                </button>
            )}

            {/* ── Chat popup ── */}
            {isOpen && (
                <div
                    className={`fixed bottom-6 right-6 z-50 flex flex-col bg-navy-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-indigo-500/10 transition-all duration-200 origin-bottom-right
                        ${isMinimized
                            ? "w-72 overflow-hidden"
                            : "w-[380px] max-w-[calc(100vw-24px)] h-[520px] max-h-[calc(100vh-96px)]"
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-navy-950 border-b border-slate-700/50 rounded-t-2xl shrink-0">
                        <div className="size-8 rounded-full bg-indigo-600 flex items-center justify-center relative shrink-0">
                            <Bot className="w-4 h-4 text-slate-50" />
                            <span className="absolute -top-px -right-px size-2.5 bg-green-500 rounded-full border-2 border-[#111827]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white leading-none">AI Tutor</h3>
                            <p className="text-[10px] text-indigo-400 mt-0.5 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> CodeMastery · Trực tuyến
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <Link
                                href="/ai/chat"
                                className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Mở trang chat đầy đủ"
                                onClick={handleClose}
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleMinimize}
                                className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Thu nhỏ"
                            >
                                <Minimize2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    handleClose();
                                    abortStream();
                                }}
                                className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                title="Đóng"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Minimized bar */}
                    {isMinimized ? (
                        <Button
                            variant="ghost"
                            onClick={() => { setIsMinimized(false); setTimeout(() => textareaRef.current?.focus(), 100); }}
                            className="flex w-full items-center justify-between px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <span className="text-xs">Nhấn để mở lại cuộc trò chuyện</span>
                            <span className="text-[10px] text-indigo-400">{messages.length - 1} tin</span>
                        </Button>
                    ) : (
                        <>
                            {view === 'history' ? (
                                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scrollbar-none">
                                    <div className="flex items-center justify-between mb-3 px-1">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase">Lịch sử chat</h4>
                                        <button 
                                            onClick={() => { setView('chat'); clearMessages(); }}
                                            className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                        >
                                            <MessageSquarePlus className="w-3 h-3" /> Phiên mới
                                        </button>
                                    </div>
                                    {isSessionsLoading ? (
                                        <p className="text-xs text-slate-500 text-center py-4">Đang tải...</p>
                                    ) : sessions.length === 0 ? (
                                        <p className="text-xs text-slate-500 text-center py-4">Chưa có lịch sử</p>
                                    ) : (
                                        sessions.map(s => (
                                            <div key={s.id} className="flex flex-col group p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer" onClick={() => { loadSession(s.id); setView('chat'); }}>
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">{s.title}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-1.5">
                                                    <p className="text-[10px] text-slate-600">{new Date(s.created_at).toLocaleDateString('vi-VN')}</p>
                                                    <button onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/10 rounded">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                            <>
                                {/* Quick prompts (initial state only) */}
                                {messages.length <= 1 && !currentSessionId && (
                                    <div className="flex gap-1.5 flex-wrap px-3 pt-2.5 pb-0 shrink-0">
                                    {QUICK_PROMPTS.map(p => (
                                        <Button
                                            key={p}
                                            variant="outline"
                                            onClick={() => handleSend(p)}
                                            className="text-[11px] h-7 text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20 hover:text-indigo-300 rounded-full px-2.5 transition-colors"
                                        >
                                            {p}
                                        </Button>
                                    ))}
                                </div>
                            )}

                            {/* Messages */}
                            <div ref={containerRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-none">
                                {messages.map((msg, index) => (
                                    <ChatMessage
                                        key={msg.id}
                                        message={msg}
                                        isTyping={isTyping}
                                        isLast={index === messages.length - 1}
                                    />
                                ))}

                                {isTyping && messages[messages.length -1]?.role !== 'assistant' && (
                                    <div className="flex gap-2">
                                        <div className="size-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                            <Bot className="w-3 h-3 text-slate-50" />
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-xl rounded-tl-sm px-4 py-2 shadow-sm">
                                            <IntelligentLoader />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="px-3 pb-3 pt-2 border-t border-slate-700/50 shrink-0">
                                <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-xl p-2 focus-within:border-indigo-500/60 transition-colors">
                                    <textarea
                                        ref={textareaRef}
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        onInput={e => {
                                            const el = e.currentTarget;
                                            el.style.height = "36px";
                                            el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
                                        }}
                                        placeholder="Hỏi về lập trình... (Enter gửi)"
                                        rows={1}
                                        disabled={isTyping}
                                        style={{ minHeight: "36px" }}
                                        className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-600 resize-none focus:outline-none disabled:opacity-50"
                                    />
                                    <Button
                                        size="icon"
                                        onClick={() => handleSend()}
                                        disabled={!input.trim() || isTyping}
                                        className="shrink-0 size-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-slate-50 rounded-lg transition-all"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                                {/* Toggle View Button */}
                                <button
                                    onClick={() => setView('history')}
                                    className="absolute -top-7 right-3 text-[10px] text-slate-500 hover:text-white flex items-center gap-1 bg-navy-950 px-2 py-1 rounded-t-lg border border-b-0 border-slate-700/50 transition-colors"
                                >
                                    <><History className="w-3 h-3" /> Lịch sử</>
                                </button>
                                <p className="text-center text-[9px] text-slate-700 mt-1.5">
                                    AI có thể sai. Hãy kiểm tra lại thông tin.
                                </p>
                            </div>
                            </>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
}
