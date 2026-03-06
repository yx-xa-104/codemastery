"use client";

import { MainLayout } from "@/components/layouts/MainLayout";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, MessageSquare, Code2, BookOpen, Zap, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

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

const FALLBACKS = [
    "Đó là câu hỏi hay! Hãy phân tích từng bước:\n\nKhái niệm này hoạt động dựa trên nguyên tắc **scope chain** — khi một function được tạo ra, nó lưu lại reference đến scope bên ngoài. Thử ví dụ:\n\n```js\nfunction outer() {\n  const count = 0;\n  return function inner() {\n    return count + 1;\n  };\n}\n```\n\n_Mình đang ở chế độ offline. Phase 6 AI thực sẽ sớm ra mắt!_ 🚀",
    "Tốt lắm! Để hiểu rõ hơn, hãy nhớ quy tắc vàng:\n\n> **Chia để trị** — mỗi function chỉ làm một việc.\n\n```python\ndef solve(n):\n    if n <= 1:\n        return n\n    return solve(n-1) + solve(n-2)\n```\n\n_Đang dùng fallback response. Phase 6 sẽ kết nối Gemini AI thật!_ ✨",
    "Câu hỏi thú vị! Trong lập trình, đây là một pattern rất phổ biến:\n\n```ts\nconst result = data\n  .filter(x => x.active)\n  .map(x => x.value)\n  .reduce((sum, v) => sum + v, 0);\n```\n\nChaining method như vậy giúp code **ngắn gọn và dễ đọc** hơn nhiều!\n\n_Đang chạy offline. Kết nối AI thật khi Phase 6 hoàn thành!_ 🔌",
];

export default function AiChatPage() {
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [fallbackIdx, setFallbackIdx] = useState(0);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const resetTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '36px';
        }
    };

    const handleSend = async (text?: string) => {
        const content = (text ?? input).trim();
        if (!content || isTyping) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        resetTextarea();
        setIsTyping(true);

        // Refocus textarea after state update
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
        } catch { /* fallback below */ }

        // Offline fallback
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
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleReset = () => {
        setMessages([INITIAL_MESSAGE]);
        setFallbackIdx(0);
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

                    {/* Suggestions */}
                    <div className="space-y-2 flex-1 overflow-y-auto">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" /> Câu hỏi gợi ý
                        </p>
                        {SUGGESTIONS.map(s => (
                            <button
                                key={s}
                                onClick={() => handleSend(s)}
                                disabled={isTyping}
                                className="w-full text-left text-xs text-slate-400 hover:text-white bg-[#0B1120] hover:bg-indigo-500/10 border border-indigo-900/30 hover:border-indigo-500/40 rounded-xl px-3 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <span className="text-indigo-500 mr-1.5">✦</span>{s}
                            </button>
                        ))}
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
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-amber-500" : "bg-indigo-600"}`}>
                                    {msg.role === "user"
                                        ? <User className="w-4 h-4 text-white" />
                                        : <Bot className="w-4 h-4 text-white" />
                                    }
                                </div>
                                <div className={`max-w-[80%] xl:max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                                    msg.role === "user"
                                        ? "bg-indigo-600 text-white rounded-tr-sm"
                                        : "bg-[#0B1120] border border-slate-700/50 text-slate-200 rounded-tl-sm"
                                }`}>
                                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:my-2">
                                        <ReactMarkdown
                                            components={{
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                code({ node, inline, className, children, ...props }: any) {
                                                    const match = /language-(\w+)/.exec(className || "");
                                                    return !inline && match ? (
                                                        <div className="rounded-lg overflow-hidden my-2 border border-slate-700">
                                                            <SyntaxHighlighter
                                                                style={vscDarkPlus as any}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                customStyle={{ margin: 0, background: '#050d1f', padding: '0.75rem', fontSize: '12px' }}
                                                                {...props}
                                                            >
                                                                {String(children).replace(/\n$/, "")}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    ) : (
                                                        <code className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-xs text-amber-300 border border-slate-700" {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                },
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
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
