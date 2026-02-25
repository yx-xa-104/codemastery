"use client";

import { Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useChat } from "@/hooks/useChat";

interface AiChatProps {
    embedded?: boolean; // When true, hide built-in header (used inside AiChatDrawer)
}

export function AiChat({ embedded = false }: AiChatProps) {
    const { messages, input, setInput, isTyping, handleSend, messagesEndRef } = useChat();

    return (
        <div className="flex flex-col h-full bg-navy-950 overflow-hidden">
            {/* Header - only shown in standalone mode */}
            {!embedded && (
                <div className="flex items-center gap-3 p-4 bg-navy-900 border-b border-slate-800 flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center relative">
                        <Bot className="w-5 h-5 text-white" />
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-navy-900"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">CodeMastery Tutor</h3>
                        <p className="text-xs text-indigo-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI Trợ giảng trực tuyến
                        </p>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                        <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-amber-500" : "bg-indigo-600"
                                }`}
                        >
                            {msg.role === "user" ? (
                                <User className="w-3.5 h-3.5 text-white" />
                            ) : (
                                <Bot className="w-3.5 h-3.5 text-white" />
                            )}
                        </div>
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user"
                                    ? "bg-indigo-600 text-white rounded-tr-sm"
                                    : "bg-navy-800 border border-slate-700/50 text-slate-200 rounded-tl-sm"
                                }`}
                        >
                            <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }: any) {
                                            const match = /language-(\w+)/.exec(className || "");
                                            return !inline && match ? (
                                                <div className="rounded-lg overflow-hidden my-2 border border-slate-800">
                                                    <SyntaxHighlighter
                                                        style={vscDarkPlus as any}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        customStyle={{ margin: 0, background: '#0a192f', padding: '0.75rem', fontSize: '13px' }}
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, "")}
                                                    </SyntaxHighlighter>
                                                </div>
                                            ) : (
                                                <code className="px-1.5 py-0.5 rounded bg-navy-900 border border-slate-700 font-mono text-xs text-amber-300" {...props}>
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
                        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
                            <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="bg-navy-800 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-800 flex-shrink-0 bg-navy-900">
                <div className="relative flex items-center">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Hỏi AI giảng viên..."
                        className="w-full bg-navy-950 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none h-[48px]"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-center text-[10px] text-slate-500 mt-1.5">
                    AI có thể trả lời sai. Hãy kiểm tra lại thông tin.
                </p>
            </div>
        </div>
    );
}
