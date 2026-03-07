"use client";

import { TeacherLayout } from "@/features/teacher/components/TeacherLayout";
import { useState } from "react";
import { Send, Bot } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const MOCK_THREADS = [
    { id: 1, name: 'Lê Văn Cường', avatar: 'L', course: 'HTML Frontend', preview: 'Thầy ơi, tại sao justify-content không hoạt động...', time: '10 phút', unread: 2, bg: 'bg-indigo-500' },
    { id: 2, name: 'Phạm Thị Mai', avatar: 'P', course: 'React Hooks', preview: 'useEffect với dependency array rỗng chạy mấy lần ạ?', time: '1 giờ', unread: 1, bg: 'bg-green-600' },
    { id: 3, name: 'Trần Văn Minh', avatar: 'T', course: 'Python Cơ bản', preview: 'Em đã hiểu về list comprehension rồi ạ, cảm ơn thầy!', time: '2 giờ', unread: 0, bg: 'bg-amber-600' },
    { id: 4, name: 'Nguyễn Thị Lan', avatar: 'N', course: 'JS Nâng cao', preview: 'Thầy cho em hỏi về Promise.all vs Promise.race...', time: '5 giờ', unread: 0, bg: 'bg-teal-600' },
    { id: 5, name: 'Hoàng Nam', avatar: 'H', course: 'Python Data', preview: 'Em không hiểu về pandas merge, thầy giải thích giúp em với', time: 'Hôm qua', unread: 0, bg: 'bg-pink-600' },
];

const MOCK_MESSAGES: Record<number, { from: 'student' | 'teacher'; text: string; time: string }[]> = {
    1: [
        { from: 'student', text: 'Thầy ơi, tại sao justify-content: space-between của em không hoạt động khi em đặt height cố định cho container ạ?', time: '10:25' },
        { from: 'teacher', text: 'Chào em! justify-content hoạt động theo chiều main axis. Nếu container không có height cố định thì nó tự co giãn theo content. Em thử cho thêm height: 100vh xem sao nhé!', time: '10:28' },
        { from: 'student', text: 'Thầy ơi, em thử rồi nhưng vẫn chưa được ạ 😅', time: '10:30' },
    ],
    2: [
        { from: 'student', text: 'useEffect với dependency array [] thì chạy mấy lần ạ thầy?', time: '09:15' },
    ],
};

export default function TeacherMessagesPage() {
    const [activeThread, setActiveThread] = useState(MOCK_THREADS[0]);
    const [message, setMessage] = useState('');

    const messages = MOCK_MESSAGES[activeThread.id] ?? [];

    const handleSend = () => {
        if (message.trim()) setMessage('');
    };

    return (
        <TeacherLayout>
            <div className="-mx-6 -my-6 lg:-mx-8 h-[calc(100vh-8rem)] flex border border-indigo-900/30 rounded-xl overflow-hidden bg-[#0B1120]">
                <div className="w-72 border-r border-indigo-900/30 flex flex-col shrink-0">
                    <div className="p-4 border-b border-indigo-900/30">
                        <h2 className="font-bold text-white text-sm mb-3">Tin nhắn</h2>
                        <input className="w-full px-3 py-2 bg-[#010816] border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500" placeholder="Tìm kiếm..." />
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-indigo-900/20">
                        {MOCK_THREADS.map(thread => (
                            <Button key={thread.id} variant="ghost" onClick={() => setActiveThread(thread)}
                                className={`w-full p-4 h-auto rounded-none justify-start text-left hover:bg-white/5 transition-colors ${activeThread.id === thread.id ? 'bg-indigo-600/10 border-r-2 border-indigo-500' : ''}`}>
                                <div className="flex items-center gap-3 w-full">
                                    <div className={`size-9 rounded-full ${thread.bg} flex items-center justify-center text-xs font-bold text-white shrink-0`}>{thread.avatar}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <p className="text-sm font-semibold text-white truncate">{thread.name}</p>
                                            <span className="text-[10px] text-slate-500 shrink-0 ml-2">{thread.time}</span>
                                        </div>
                                        <p className="text-xs text-indigo-400 mb-0.5">{thread.course}</p>
                                        <p className="text-xs text-slate-500 truncate">{thread.preview}</p>
                                    </div>
                                    {thread.unread > 0 && (
                                        <span className="shrink-0 size-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">{thread.unread}</span>
                                    )}
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                    <div className="h-14 border-b border-indigo-900/30 flex items-center justify-between px-5">
                        <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-full ${activeThread.bg} flex items-center justify-center text-xs font-bold text-white`}>{activeThread.avatar}</div>
                            <div>
                                <p className="text-sm font-bold text-white">{activeThread.name}</p>
                                <p className="text-xs text-indigo-400">{activeThread.course}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="flex items-center gap-1.5 h-auto text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 border-amber-500/20 px-3 py-1.5 rounded-full transition-colors">
                            <Bot className="w-3.5 h-3.5" /> Gợi ý AI
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.from === 'teacher' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${msg.from === 'teacher'
                                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                                    : 'bg-[#0B1120] border border-indigo-900/30 text-slate-300 rounded-tl-sm'}`}>
                                    <p>{msg.text}</p>
                                    <p className={`text-[10px] mt-1 ${msg.from === 'teacher' ? 'text-indigo-200' : 'text-slate-500'}`}>{msg.time}</p>
                                </div>
                            </div>
                        ))}
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
                                <p>Chọn một cuộc hội thoại để bắt đầu</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-indigo-900/30">
                        <div className="flex items-end gap-3">
                            <textarea value={message} onChange={e => setMessage(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                rows={1} placeholder="Nhắn tin cho học viên..."
                                className="flex-1 bg-[#010816] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none" />
                            <Button onClick={handleSend} size="icon" className="size-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-colors shrink-0">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
