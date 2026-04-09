"use client";

import { TeacherLayout } from "@/features/teacher/components/TeacherLayout";
import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Bot, Trash2, Loader2, BookOpen, Ban, ShieldAlert, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function TeacherMessagesPage() {
    const router = useRouter();
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [activeClassroomId, setActiveClassroom] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const channelRef = useRef<any>(null);
    const [messageInput, setMessageInput] = useState('');
    const [loadingClassrooms, setLoadingClassrooms] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [sending, setSending] = useState(false);
    const [showBlockedModal, setShowBlockedModal] = useState(false);
    const [blockedStudents, setBlockedStudents] = useState<any[]>([]);
    const [loadingBlocked, setLoadingBlocked] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth/login');
                return;
            }
            
            // Get current user profile
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            setCurrentUser(profile);

            try {
                const res = await fetch(`${API_URL}/api/classrooms/teacherhips`, {
                    headers: { 'Authorization': `Bearer ${session.access_token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setClassrooms(data);
                    if (data.length > 0) {
                        setActiveClassroom(data[0].course_id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch classrooms", err);
            } finally {
                setLoadingClassrooms(false);
            }
        };

        init();
    }, [API_URL, router]);

    useEffect(() => {
        if (!activeClassroomId) return;
        
        const fetchMessages = async (silent = false) => {
            if (!silent) setLoadingMessages(true);
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            try {
                const timestamp = new Date().getTime();
                const res = await fetch(`${API_URL}/api/classrooms/course/${activeClassroomId}/posts?t=${timestamp}`, {
                    headers: { 
                        'Authorization': `Bearer ${session.access_token}`,
                        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
                    },
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                    setTimeout(scrollToBottom, 100);
                }
            } catch (err) {
                console.error("Failed to fetch messages", err);
            } finally {
                if (!silent) setLoadingMessages(false);
            }
        };

        const supabase = createClient();

        fetchMessages().then(async () => {
            channelRef.current = supabase
                .channel(`classroom_${activeClassroomId}`)
                .on('broadcast', { event: 'new_post' }, (payload) => {
                    setTimeout(() => fetchMessages(true), 300);
                })
                .subscribe();
            
            // Also listen to notifications to update sidebar dot
        });

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [activeClassroomId, API_URL]);

    const handleSend = async () => {
        if (!messageInput.trim() || !activeClassroomId || !currentUser) return;

        
        setSending(true);
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`${API_URL}/api/classrooms/course/${activeClassroomId}/posts`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: messageInput })
            });

            if (res.ok) {
                const newPost = await res.json();
                setMessages(prev => [...prev, newPost]);
                setMessageInput('');
                setTimeout(scrollToBottom, 50);
                
                // Broadcast to other clients
                if (channelRef.current) {
                    channelRef.current.send({ type: 'broadcast', event: 'new_post', payload: {} });
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa/thu hồi tin nhắn này không?")) return;
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`${API_URL}/api/classrooms/course/${activeClassroomId}/posts/${postId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== postId));
            } else {
                alert("Không thể xóa tin nhắn.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadBlockedStudents = async () => {
        if (!activeClassroomId) return;
        setLoadingBlocked(true);
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const res = await fetch(`${API_URL}/api/classrooms/course/${activeClassroomId}/blocked`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (res.ok) {
                setBlockedStudents(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingBlocked(false);
        }
    };

    const handleBlock = async (studentId: string, name: string) => {
        if (!confirm(`Bạn có chắc muốn chặn học viên ${name} khỏi phần hỏi đáp không?`)) return;
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const res = await fetch(`${API_URL}/api/classrooms/course/${activeClassroomId}/block/${studentId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (res.ok) {
                alert(`Đã chặn học viên ${name}`);
            } else {
                alert("Không thể chặn học viên.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnblock = async (studentId: string, name: string) => {
        if (!confirm(`Bạn muốn hủy chặn học viên ${name}?`)) return;
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const res = await fetch(`${API_URL}/api/classrooms/course/${activeClassroomId}/unblock/${studentId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (res.ok) {
                alert(`Đã hủy chặn học viên ${name}`);
                loadBlockedStudents();
            } else {
                alert("Không thể hủy chặn học viên.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (showBlockedModal && activeClassroomId) {
            loadBlockedStudents();
        }
    }, [showBlockedModal, activeClassroomId]);

    const activeClassroomFull = classrooms.find(c => c.course_id === activeClassroomId);

    return (
        <TeacherLayout title="Hỏi đáp Lớp học">
            <div className="-mx-6 -my-6 lg:-mx-8 h-[calc(100vh-8rem)] flex border border-indigo-900/30 rounded-xl overflow-hidden bg-[#0B1120]">
                {/* Left Sidebar - Classrooms list */}
                <div className="w-72 border-r border-indigo-900/30 flex flex-col shrink-0 bg-[#050C1F]">
                    <div className="p-4 border-b border-indigo-900/30">
                        <h2 className="font-bold text-white text-sm mb-3">Lớp học / Khóa học</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-indigo-900/20">
                        {loadingClassrooms ? (
                            <div className="flex justify-center p-8"><Loader2 className="w-5 h-5 animate-spin text-indigo-500" /></div>
                        ) : classrooms.length === 0 ? (
                            <div className="text-center p-6 text-slate-500 text-xs">Chưa có lớp học nào</div>
                        ) : classrooms.map(classroom => {
                            const isActive = activeClassroomId === classroom.course_id;
                            const course = classroom.courses;
                            return (
                                <Button 
                                    key={classroom.id} 
                                    variant="ghost" 
                                    onClick={() => setActiveClassroom(classroom.course_id)}
                                    className={`w-full p-4 h-auto rounded-none justify-start text-left hover:bg-white/5 transition-colors ${isActive ? 'bg-indigo-600/10 border-r-2 border-indigo-500' : ''}`}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className={`size-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden`}>
                                            {course?.thumbnail_url ? (
                                                <img src={course.thumbnail_url} className="w-full h-full object-cover" />
                                            ) : <BookOpen className="w-5 h-5 text-indigo-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{course?.title || classroom.name}</p>
                                            <p className="text-xs text-indigo-400 mb-0.5">{course?.level}</p>
                                        </div>
                                    </div>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Area - Chat Room */}
                <div className="flex-1 flex flex-col min-w-0">
                    {activeClassroomFull ? (
                        <>
                            <div className="h-14 border-b border-indigo-900/30 flex items-center justify-between px-5 bg-slate-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{activeClassroomFull.name}</p>
                                        <p className="text-xs text-indigo-400">Không gian thảo luận chung</p>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hover:text-white"
                                    onClick={() => setShowBlockedModal(true)}
                                >
                                    <ShieldAlert className="w-4 h-4 mr-2" />
                                    Quản lý tính năng chặn
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {loadingMessages ? (
                                    <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
                                        <p>Chưa có câu hỏi hay thảo luận nào</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isTeacher = msg.profiles?.role === 'teacher';
                                        const isMyPost = msg.author_id === currentUser?.id;
                                        
                                        return (
                                            <div key={msg.id} className={`flex flex-col mb-4 bg-[#010816]/50 p-4 rounded-xl border border-indigo-900/30`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-6 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                                            {msg.profiles?.avatar_url ? <img src={msg.profiles.avatar_url} /> : <div className="text-[10px] text-white">{msg.profiles?.full_name?.[0]}</div>}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-semibold text-white flex items-center gap-2">
                                                                {msg.profiles?.full_name}
                                                                {isTeacher && <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 rounded-sm border border-indigo-500/20">Giảng viên</span>}
                                                            </span>
                                                            {/* REQUIREMENT: Show Student ID and Class Code to teacher */}
                                                            {!isTeacher && msg.profiles && (
                                                                <span className="text-[10px] text-slate-400">
                                                                    MSSV: {msg.profiles.student_id || 'N/A'} - Lớp: {msg.profiles.class_code || 'N/A'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] text-slate-500">{new Date(msg.created_at).toLocaleString('vi-VN')}</span>
                                                        {/* REQUIREMENT: Allow teacher to delete/recall messages */}
                                                        {currentUser?.role === 'teacher' && (
                                                            <div className="flex items-center gap-1.5">
                                                                {!isTeacher && msg.profiles && (
                                                                    <button title="Chặn người này khỏi thảo luận" onClick={() => handleBlock(msg.author_id, msg.profiles.full_name || 'Học viên')} className="text-amber-500 hover:text-amber-400 transition-colors bg-amber-500/10 p-1.5 rounded disabled:opacity-50">
                                                                        <Ban className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                                <button title="Xóa/Thu hồi tin nhắn" onClick={() => handleDelete(msg.id)} className="text-red-400 hover:text-red-300 transition-colors bg-red-400/10 p-1.5 rounded">
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-slate-300 pl-8 w-full wrap-break-word whitespace-pre-wrap">
                                                    {msg.content}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 border-t border-indigo-900/30 bg-slate-900/50">
                                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                                    <textarea 
                                        value={messageInput} 
                                        onChange={e => setMessageInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                        rows={2} 
                                        placeholder="Nhắn tin vào lớp học..."
                                        disabled={sending}
                                        className="flex-1 bg-[#010816] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none disabled:opacity-50" 
                                    />
                                    <Button onClick={handleSend} disabled={sending || !messageInput.trim()} size="icon" className="size-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-colors shrink-0">
                                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <BookOpen className="w-16 h-16 text-slate-800 mb-4" />
                            <p>Vui lòng chọn một lớp học để xem thảo luận</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Blocked Students Modal */}
            {showBlockedModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0B1120] border border-indigo-500/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-indigo-900/40 bg-[#050C1F]">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                                Danh sách học viên bị chặn thảo luận
                            </h3>
                            <button onClick={() => setShowBlockedModal(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-5 max-h-[60vh] overflow-y-auto">
                            {loadingBlocked ? (
                                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                            ) : blockedStudents.length === 0 ? (
                                <div className="text-center py-8">
                                    <Ban className="w-12 h-12 text-slate-700 mx-auto mb-3 opacity-50" />
                                    <p className="text-slate-400 text-sm">Chưa có học viên nào bị chặn trong khóa học này.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {blockedStudents.map((blocked) => (
                                        <div key={blocked.user_id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-indigo-900/30">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                                    {blocked.profiles?.avatar_url ? (
                                                        <img src={blocked.profiles.avatar_url} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-xs font-semibold text-white">{blocked.profiles?.full_name?.[0]}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{blocked.profiles?.full_name}</p>
                                                    <p className="text-xs text-slate-500">MSSV: {blocked.profiles?.student_id || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-600 hover:text-white"
                                                onClick={() => handleUnblock(blocked.user_id, blocked.profiles?.full_name || 'Học viên')}
                                            >
                                                Bỏ chặn
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </TeacherLayout>
    );
}
