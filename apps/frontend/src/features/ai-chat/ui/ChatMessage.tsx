import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
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

export function ChatMessage({ message, isTyping, isLast }: ChatMessageProps) {
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
        <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-amber-500" : "bg-indigo-600"}`}>
                {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${isUser
                ? "bg-indigo-600 text-white rounded-tr-sm"
                : "bg-navy-800 border border-slate-700/50 text-slate-200 rounded-tl-sm"
                }`}>

                {showTypingInsteadOfContent ? (
                    <div className="flex gap-1 items-center h-5">
                        <span className="size-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="size-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="size-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                ) : (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:my-2">
                        <ReactMarkdown
                            components={{
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                code({ inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    return !inline && match ? (
                                        <div className="rounded-lg overflow-hidden my-2 border border-slate-700">
                                            <SyntaxHighlighter
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                            {cleanedContent}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
