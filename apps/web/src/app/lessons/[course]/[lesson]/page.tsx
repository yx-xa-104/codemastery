"use client";

import { Sidebar } from "@/components/layouts/Sidebar";
import { CodeEditor } from "@/components/features/editor/CodeEditor";
import { AiChatDrawer } from "@/components/features/ai/AiChatDrawer";
import { useState } from "react";
import { ArrowLeft, Menu, X, CheckCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function LessonPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Sample data
    const modules = [
        {
            id: "m1",
            title: "Căn bản về JavaScript",
            lessons: [
                { id: "l1", title: "Giới thiệu JavaScript", duration: "10:00", isCompleted: true, type: "video" as const, slug: "intro" },
                { id: "l2", title: "Biến và Kiểu dữ liệu", duration: "15:00", isCompleted: true, type: "interactive" as const, slug: "variables" },
                { id: "l3", title: "Vòng lặp For", duration: "20:00", isCompleted: false, type: "interactive" as const, slug: "for-loop" },
            ]
        }
    ];

    const lessonContent = `
# Vòng lặp \`for\` trong JavaScript

Vòng lặp \`for\` là một cấu trúc điều khiển lặp lặp đi lặp lại một khối lệnh một số lần nhất định.

## Cú pháp:
\`\`\`javascript
for (khởi tạo; điều kiện; bước tiếp) {
  // code thực thi
}
\`\`\`

## Yêu cầu bài tập:
Hãy sử dụng vòng lặp \`for\` để in ra các số từ 1 đến 5.
`;

    return (
        <div className="flex flex-col h-screen bg-navy-950 text-slate-300 overflow-hidden font-sans">

            {/* ===== TOP BAR - full width, always on top ===== */}
            <div className="flex h-14 bg-navy-950 border-b border-slate-800 items-center justify-between px-4 flex-shrink-0 z-50 relative">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Sidebar toggle (mobile) */}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Back button */}
                    <Link href="/courses" className="flex w-8 h-8 rounded-full bg-navy-800 items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>

                    <h1 className="font-bold text-white text-sm lg:text-base tracking-tight truncate">
                        3. Vòng lặp For
                    </h1>
                </div>

                <button className="px-3 lg:px-4 py-2 bg-indigo-600/15 text-indigo-400 border border-indigo-500/25 hover:bg-indigo-600 hover:text-white rounded-lg transition-all flex items-center gap-2 text-xs lg:text-sm font-semibold flex-shrink-0">
                    <CheckCircle className="w-4 h-4" />
                    Đánh dấu hoàn thành
                </button>
            </div>

            {/* ===== BODY: Sidebar + Content ===== */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Sidebar backdrop (mobile) */}
                {isSidebarOpen && (
                    <div
                        className="fixed top-14 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <Sidebar courseTitle="JavaScript Nâng cao" modules={modules} courseSlug="javascript-advanced" isOpen={isSidebarOpen} />

                {/* Main content area */}
                <div className="flex-1 flex flex-col lg:ml-80 h-full min-w-0">
                    {/* Content: 2-column layout (Lesson + Editor) + AI Chat push panel */}
                    <div className="flex-1 overflow-hidden flex flex-row">
                        {/* Lesson + Editor columns */}
                        <div className="flex-1 flex flex-col lg:flex-row gap-0 min-w-0">
                            {/* Column 1: Reading Material */}
                            <div className="lg:w-[40%] xl:w-[35%] h-[35vh] lg:h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-800 flex-shrink-0">
                                <div className="p-5 lg:p-6">
                                    <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                                        <BookOpen className="w-4 h-4" />
                                        Nội dung bài học
                                    </div>
                                    <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-navy-900 prose-pre:border prose-pre:border-slate-800 prose-headings:text-slate-100 prose-p:text-slate-400 prose-p:leading-relaxed">
                                        <ReactMarkdown>
                                            {lessonContent}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Code Editor (fills remaining space) */}
                            <div className="flex-1 min-h-0 min-w-0 p-3 lg:p-4">
                                <CodeEditor initialCode={`// In các số từ 1 đến 5\n`} />
                            </div>
                        </div>

                        {/* AI Chat - inline push panel (desktop) */}
                        <AiChatDrawer />
                    </div>
                </div>
            </div>
        </div>
    );
}
