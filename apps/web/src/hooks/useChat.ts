"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Message } from "@/types";

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content:
                "Chào bạn! Mình là AI Tutor của CodeMastery. Trong bài học này, bạn cần sử dụng vòng lặp `for` để duyệt qua mảng. Bạn có thắc mắc gì không?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = useCallback(() => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `Tôi hiểu vấn đề của bạn. Để sửa lỗi đó, hãy thử đoạn code sau nhé:
\`\`\`javascript
for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}
\`\`\`
Nếu vẫn còn thắc mắc, đừng ngại hỏi tiếp!`,
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    }, [input]);

    return { messages, input, setInput, isTyping, handleSend, messagesEndRef };
}
