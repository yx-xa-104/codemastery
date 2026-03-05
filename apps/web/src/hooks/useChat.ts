"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Message } from "@/types";

const INITIAL_MESSAGE: Message = {
    id: "init",
    role: "assistant",
    content: "Xin chào! Mình là AI Tutor của CodeMastery. Bạn cần hỗ trợ gì về lập trình không? 😊\n\nMình có thể giúp:\n- Giải thích khái niệm lập trình\n- Debug và sửa lỗi code\n- Gợi ý cách tiếp cận bài toán",
};

const STATIC_RESPONSES = [
    "Đó là câu hỏi hay! Để hiểu vấn đề này, bạn cần nắm vững khái niệm cơ bản về cách hoạt động của bộ nhớ trong lập trình. Hãy thử cách này:",
    "Mình thấy vấn đề rồi! Lỗi thường gặp trong trường hợp này là do kiểm tra điều kiện biên. Hãy kiểm tra lại vòng lặp của bạn:",
    "Tốt lắm! Bạn đang đi đúng hướng. Để tối ưu hơn, hãy cân nhắc dùng cấu trúc dữ liệu phù hợp:",
];

export function useChat(context?: { lessonTitle?: string; courseTitle?: string }) {
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const responseIndex = useRef(0);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = useCallback(async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            // Try to call real AI API (Phase 6 integration point)
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input.trim(),
                    context: context ? `Bài học: ${context.lessonTitle ?? ''}, Khóa học: ${context.courseTitle ?? ''}` : undefined,
                }),
                signal: AbortSignal.timeout(8000),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.reply ?? data.content ?? "Xin lỗi, mình không hiểu câu hỏi. Bạn thử hỏi lại nhé!",
                }]);
            } else {
                throw new Error("API not available");
            }
        } catch {
            // Fallback: static responses until Phase 6 is ready
            const resp = STATIC_RESPONSES[responseIndex.current % STATIC_RESPONSES.length];
            responseIndex.current++;
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: `${resp}\n\n\`\`\`javascript\n// Gợi ý code của bạn\nconsole.log("Hello from AI Tutor!");\n\`\`\`\n\n_Mình đang trong chế độ offline. Phase 6 AI thực sẽ sớm ra mắt!_`,
                }]);
                setIsTyping(false);
            }, 1000);
            return;
        }

        setIsTyping(false);
    }, [input, context]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    return { messages, input, setInput, isTyping, handleSend, handleKeyDown, messagesEndRef };
}
