"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, X, Send, User, Sparkles, Minimize2, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

const WELCOME: Message = {
    id: "init",
    role: "assistant",
    content: "Xin chào! 👋 Mình là **AI Tutor** của CodeMastery.\n\nBạn cần hỗ trợ gì về lập trình không?",
};

const FALLBACKS = [
    "Đây là câu hỏi thú vị! Hãy phân tích từng bước:\n\n```js\n// Ví dụ minh họa\nconst solve = (n) => n <= 1 ? n : solve(n-1) + solve(n-2);\n```\n\n_AI đang offline, Phase 6 sẽ tích hợp Gemini thật_ 🚀",
    "Tốt lắm! Khái niệm này hoạt động dựa trên **scope chain** và closure. Thử xem:\n\n```python\ndef outer():\n    count = 0\n    def inner():\n        return count + 1\n    return inner\n```\n\n_Đang dùng fallback. AI thật sẽ sớm ra mắt!_ ✨",
    "Pattern này rất phổ biến trong lập trình hiện đại:\n\n```ts\nconst result = items\n  .filter(x => x.active)\n  .map(x => x.value);\n```\n\n_Offline mode. Gemini AI sẽ thay thế trong Phase 6!_ 💡",
];

const QUICK_PROMPTS = ["Closure là gì?", "Debug lỗi TypeScript", "Giải thích async/await"];

export function GlobalAiChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [fallbackIdx, setFallbackIdx] = useState(0);
    const [hasUnread, setHasUnread] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Scroll messages container (not window)
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    // Mark unread when AI responds while closed/minimized
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg?.role === "assistant" && lastMsg.id !== "init" && (!isOpen || isMinimized)) {
            setHasUnread(true);
        }
    }, [messages, isOpen, isMinimized]);

    const handleOpen = () => {
        setIsOpen(true);
        setIsMinimized(false);
        setHasUnread(false);
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

        setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content }]);
        setInput("");
        resetTextarea();
        setIsTyping(true);
        setTimeout(() => textareaRef.current?.focus(), 0);

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: content }),
                signal: AbortSignal.timeout(8000),
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.reply ?? data.content,
                }]);
                setIsTyping(false);
                setTimeout(() => textareaRef.current?.focus(), 0);
                return;
            }
        } catch { /* fallback */ }

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: FALLBACKS[fallbackIdx % FALLBACKS.length],
            }]);
            setFallbackIdx(i => i + 1);
            setIsTyping(false);
            textareaRef.current?.focus();
        }, 1200);
    }, [input, isTyping, fallbackIdx]);

    return (
        <>
            {/* ── FAB Button ── */}
            {!isOpen && (
                <button
                    onClick={handleOpen}
                    aria-label="Mở AI Tutor"
                    className="fixed bottom-6 right-6 z-50 group"
                >
                    {/* Pulse ring */}
                    <span className="absolute inset-0 rounded-full bg-indigo-500 opacity-30 animate-ping" />

                    <span className="relative flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl shadow-indigo-600/40 transition-all duration-200 group-hover:scale-105 group-hover:shadow-indigo-500/50">
                        <Bot className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-semibold tracking-tight">AI Tutor</span>
                        {/* Online dot */}
                        <span className="absolute -top-0.5 -right-0.5 size-3.5 bg-green-500 rounded-full border-2 border-[#010816]" />
                        {/* Unread badge */}
                        {hasUnread && (
                            <span className="absolute -top-1.5 -left-1.5 size-5 bg-amber-500 rounded-full border-2 border-[#010816] flex items-center justify-center text-[9px] font-bold">
                                !
                            </span>
                        )}
                    </span>
                </button>
            )}

            {/* ── Chat popup ── */}
            {isOpen && (
                <div
                    className={`fixed bottom-6 right-6 z-50 flex flex-col bg-[#0B1120] border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/50 transition-all duration-200 origin-bottom-right
                        ${isMinimized
                            ? "w-72 overflow-hidden"
                            : "w-[380px] max-w-[calc(100vw-24px)] h-[520px] max-h-[calc(100vh-96px)]"
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#111827] border-b border-slate-700/60 rounded-t-2xl shrink-0">
                        <div className="size-8 rounded-full bg-indigo-600 flex items-center justify-center relative shrink-0">
                            <Bot className="w-4 h-4 text-white" />
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
                            <button
                                onClick={handleMinimize}
                                className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Thu nhỏ"
                            >
                                <Minimize2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={handleClose}
                                className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Đóng"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Minimized bar */}
                    {isMinimized ? (
                        <button
                            onClick={() => { setIsMinimized(false); setTimeout(() => textareaRef.current?.focus(), 100); }}
                            className="flex items-center justify-between px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <span className="text-xs">Nhấn để mở lại cuộc trò chuyện</span>
                            <span className="text-[10px] text-indigo-400">{messages.length - 1} tin</span>
                        </button>
                    ) : (
                        <>
                            {/* Quick prompts (initial state only) */}
                            {messages.length <= 1 && (
                                <div className="flex gap-1.5 px-3 pt-2.5 pb-0 shrink-0 flex-wrap">
                                    {QUICK_PROMPTS.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => handleSend(p)}
                                            className="text-[11px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 hover:text-indigo-300 rounded-full px-2.5 py-1 transition-colors"
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Messages */}
                            <div ref={containerRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                    >
                                        <div className={`size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "user" ? "bg-amber-500" : "bg-indigo-600"}`}>
                                            {msg.role === "user"
                                                ? <User className="w-3 h-3 text-white" />
                                                : <Bot className="w-3 h-3 text-white" />
                                            }
                                        </div>
                                        <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                                            msg.role === "user"
                                                ? "bg-indigo-600 text-white rounded-tr-sm"
                                                : "bg-[#1a2744] border border-slate-700/40 text-slate-200 rounded-tl-sm"
                                        }`}>
                                            <div className="prose prose-invert prose-xs max-w-none [&_pre]:text-[11px] [&_code]:text-[11px] [&_p]:my-0.5">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex gap-2">
                                        <div className="size-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                            <Bot className="w-3 h-3 text-white" />
                                        </div>
                                        <div className="bg-[#1a2744] border border-slate-700/40 rounded-xl rounded-tl-sm px-3 py-2.5">
                                            <div className="flex gap-1 items-center">
                                                <span className="size-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <span className="size-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <span className="size-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="px-3 pb-3 pt-2 border-t border-slate-700/60 shrink-0">
                                <div className="flex items-end gap-2 bg-[#0d1526] border border-slate-700/60 rounded-xl p-2 focus-within:border-indigo-500/60 transition-colors">
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
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={!input.trim() || isTyping}
                                        className="shrink-0 size-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <p className="text-center text-[9px] text-slate-700 mt-1.5">
                                    AI có thể sai. Hãy kiểm tra lại thông tin.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
