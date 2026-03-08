"use client";

import { Send, Bot, Sparkles } from "lucide-react";
import { useAiChat } from "@/features/ai-chat/model/useAiChat";
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/features/ai-chat/ui/ChatMessage";

import { Button } from "@/shared/components/ui/button";

interface AiChatProps {
    embedded?: boolean; // When true, hide built-in header (used inside AiChatDrawer)
}

export function AiChat({ embedded = false }: AiChatProps) {
    const { messages, isLoading: isTyping, sendMessage } = useAiChat();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || isTyping) return;
        sendMessage(input.trim());
        setInput("");
    };

    return (
        <div className="flex flex-col h-full bg-navy-950 overflow-hidden">
            {/* Header - only shown in standalone mode */}
            {!embedded && (
                <div className="flex items-center gap-3 p-4 bg-navy-900 border-b border-slate-800 shrink-0">
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
                        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                            <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="bg-navy-800 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1 items-center h-4">
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
            <div className="p-3 border-t border-slate-800 shrink-0 bg-navy-900">
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
                    <Button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isTyping}
                        size="icon"
                        className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
                <p className="text-center text-[10px] text-slate-500 mt-1.5">
                    AI có thể trả lời sai. Hãy kiểm tra lại thông tin.
                </p>
            </div>
        </div>
    );
}
