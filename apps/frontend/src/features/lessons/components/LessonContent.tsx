"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen } from "lucide-react";

interface LessonContentProps {
    content: string | null;
}

export function LessonContent({ content }: LessonContentProps) {
    if (!content) {
        return (
            <p className="text-slate-500 italic text-sm">
                Nội dung bài học đang được cập nhật...
            </p>
        );
    }

    return (
        <div className="lesson-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // ─── Headings ─────────────────────────────────────────
                    h1: ({ children }) => (
                        <h1 className="text-xl font-bold text-white mb-4 mt-2 pb-2 border-b border-slate-700/50">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-lg font-semibold text-indigo-300 mb-3 mt-6 flex items-center gap-2">
                            <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block" />
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-base font-semibold text-slate-200 mb-2 mt-4">
                            {children}
                        </h3>
                    ),

                    // ─── Paragraph ────────────────────────────────────────
                    p: ({ children }) => (
                        <p className="text-slate-400 text-sm leading-7 mb-3">
                            {children}
                        </p>
                    ),

                    // ─── Code Blocks ──────────────────────────────────────
                    pre: ({ children }) => (
                        <div className="my-4 rounded-lg overflow-hidden border border-slate-700/60 bg-[#0d1117]">
                            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-800/80 border-b border-slate-700/60">
                                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                            </div>
                            <div className="overflow-x-auto p-4">
                                {children}
                            </div>
                        </div>
                    ),
                    code: ({ className, children, ...props }) => {
                        const isBlock = className?.startsWith("language-");
                        if (isBlock) {
                            const lang = className?.replace("language-", "") ?? "";
                            return (
                                <code
                                    className="text-[13px] leading-6 font-mono text-emerald-300 whitespace-pre block"
                                    data-lang={lang}
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }
                        // Inline code
                        return (
                            <code
                                className="px-1.5 py-0.5 rounded bg-slate-700/60 text-sky-300 text-[13px] font-mono border border-slate-600/40"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },

                    // ─── Tables ───────────────────────────────────────────
                    table: ({ children }) => (
                        <div className="my-4 overflow-x-auto rounded-lg border border-slate-700/60">
                            <table className="w-full text-sm">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-slate-800/60 text-slate-300 text-xs uppercase tracking-wider">
                            {children}
                        </thead>
                    ),
                    tbody: ({ children }) => (
                        <tbody className="divide-y divide-slate-700/40">
                            {children}
                        </tbody>
                    ),
                    tr: ({ children }) => (
                        <tr className="hover:bg-slate-800/30 transition-colors">
                            {children}
                        </tr>
                    ),
                    th: ({ children }) => (
                        <th className="px-4 py-2.5 text-left font-semibold text-indigo-300">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 py-2.5 text-slate-400">
                            {children}
                        </td>
                    ),

                    // ─── Lists ────────────────────────────────────────────
                    ul: ({ children }) => (
                        <ul className="my-3 space-y-1.5 text-sm text-slate-400">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-3 space-y-1.5 text-sm text-slate-400 list-decimal list-inside">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="flex items-start gap-2 leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500/70 shrink-0" />
                            <span>{children}</span>
                        </li>
                    ),

                    // ─── Blockquote ───────────────────────────────────────
                    blockquote: ({ children }) => (
                        <blockquote className="my-4 pl-4 border-l-2 border-amber-500/60 bg-amber-500/5 rounded-r-lg py-2 pr-4">
                            <div className="text-amber-200/80 text-sm [&>p]:mb-1">
                                {children}
                            </div>
                        </blockquote>
                    ),

                    // ─── Links & Strong ───────────────────────────────────
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                        >
                            {children}
                        </a>
                    ),
                    strong: ({ children }) => (
                        <strong className="text-slate-200 font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                        <em className="text-slate-300 italic">{children}</em>
                    ),

                    // ─── Horizontal Rule ──────────────────────────────────
                    hr: () => (
                        <hr className="my-6 border-slate-700/50" />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
