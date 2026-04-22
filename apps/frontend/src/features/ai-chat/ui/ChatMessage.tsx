import { memo } from "react";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import dynamic from 'next/dynamic';
import { IntelligentLoader } from "./IntelligentLoader";

// Lazy load the SyntaxHighlighter to reduce initial bundle size
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then(mod => mod.Prism),
  { ssr: false }
);

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface ChatMessageProps {
    message: Message;
    isTyping?: boolean;
    isLast?: boolean;
}

export const ChatMessage = memo(function ChatMessage({ message, isTyping, isLast }: ChatMessageProps) {
    const isUser = message.role === "user";

    // If it's an assistant message, and it's the last one, and they are typing, and the content is EXACTLY empty,
    // we JUST show the typing indicator bubble instead of an empty markdown output.
    const showTypingInsteadOfContent = !isUser && isLast && isTyping && message.content === '';

    let cleanedContent = message.content
        .replace(/\**Support Pollinations\.AI\**[:]?[\s\S]*$/i, '')
        .replace(/🌸\s*Ad\s*🌸[\s\S]*$/i, '')
        .trim();

    if (cleanedContent.startsWith('Lỗi HTTP') || cleanedContent.includes('{"error"')) {
        cleanedContent = "Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại!";
    }

    return (
        <div className={`flex gap-3 max-w-4xl mx-auto w-full ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`size-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${isUser ? "bg-amber-500" : "bg-indigo-600"}`}>
                {isUser ? <User className="w-4 h-4 text-slate-50" /> : <Bot className="w-4 h-4 text-slate-50" />}
            </div>
            <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-base leading-relaxed ${isUser
                ? "bg-indigo-600 text-slate-50 rounded-tr-sm"
                : "bg-navy-800 border border-slate-700/50 text-slate-200 rounded-tl-sm shadow-sm"
                }`}>

                {showTypingInsteadOfContent ? (
                    <IntelligentLoader />
                ) : (
                    <div className="prose prose-invert prose-base max-w-none prose-p:my-2 prose-pre:my-3">
                        <ReactMarkdown
                            components={{
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                code({ inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const isBlock = !inline && match; // Strict block with language
                                    const isOrphanBlock = !inline && !match && String(children).includes('\n'); // Block without language but has multi-lines
                                    
                                    if (isBlock || isOrphanBlock) {
                                        return (
                                            <div className="rounded-xl overflow-hidden my-3 border border-slate-700 shadow-md">
                                                <SyntaxHighlighter
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    style={vscDarkPlus as any}
                                                    language={match ? match[1] : "text"}
                                                    PreTag="div"
                                                    customStyle={{ margin: 0, background: '#050d1f', padding: '1rem', fontSize: '14px', lineHeight: '1.5' }}
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, "")}
                                                </SyntaxHighlighter>
                                            </div>
                                        );
                                    }

                                    return (
                                        <code className="px-1.5 py-0.5 rounded-md bg-slate-800 font-mono text-[13px] text-amber-300 border border-slate-700" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {cleanedContent}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
});
