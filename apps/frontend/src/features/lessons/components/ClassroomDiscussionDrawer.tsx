"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/client";

interface Props {
    courseId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ClassroomDiscussionDrawer({ courseId, isOpen, onClose }: Props) {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const channelRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!isOpen) return;
        
        const supabase = createClient();

        const fetchMessages = async (silent = false) => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            setCurrentUser(profile);

            try {
                const timestamp = new Date().getTime();
                const res = await fetch(`${API_URL}/api/classrooms/course/${courseId}/posts?t=${timestamp}`, {
                    headers: { 
                        'Authorization': `Bearer ${session.access_token}`,
                        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
                    },
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                    setTimeout(scrollToBottom, 50);
                }
            } catch (err) {
                console.error("Failed to fetch messages", err);
            } finally {
                if (!silent) setLoading(false);
            }
        };

        fetchMessages().then(() => {
            // Subscribe to real-time broadcasts
            channelRef.current = supabase
                .channel(`classroom_${courseId}`)
                .on('broadcast', { event: 'new_post' }, () => {
                    setTimeout(() => fetchMessages(true), 300);
                })
                .subscribe();
        });

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [courseId, isOpen, API_URL]);

    const handleSend = async () => {
        if (!messageInput.trim() || !currentUser) return;
        setSending(true);
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`${API_URL}/api/classrooms/course/${courseId}/posts`, {
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
                
                // Broadcast using the exactly same channel
                if (channelRef.current) {
                    channelRef.current.send({ type: 'broadcast', event: 'new_post', payload: {} });
                }
            } else {
                const errorData = await res.json();
                alert(errorData?.message || "Không thể gửi tin nhắn.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa tin nhắn này không?")) return;
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`${API_URL}/api/classrooms/course/${courseId}/posts/${postId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== postId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 z-50 bg-transparent sm:bg-black/20 transition-opacity" 
                onClick={onClose} 
            />
            <div className="fixed inset-y-0 right-0 z-60 w-full sm:w-[400px] bg-[#050C1F] border-l border-indigo-900/40 shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-indigo-900/40 bg-slate-900/50 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                        <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Hỏi đáp & Thảo luận</h3>
                        <p className="text-xs text-indigo-400">Không gian chung của lớp học</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
                        <MessageSquare className="w-12 h-12 text-slate-800 mb-3" />
                        <p>Chưa có câu hỏi hay thảo luận nào</p>
                        <p className="text-xs mt-1">Hãy là người đầu tiên đặt câu hỏi!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isTeacher = msg.profiles?.role === 'teacher';
                        const isMyPost = msg.author_id === currentUser?.id;
                        
                        return (
                            <div key={msg.id} className={`flex flex-col mb-4 p-3 rounded-xl border border-indigo-900/30 ${isMyPost ? 'bg-indigo-900/20' : 'bg-[#010816]/50'}`}>
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
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-500">{new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute:'2-digit' })}</span>
                                        {/* Students can only delete their own messages. Teacher can delete any. */}
                                        {(isMyPost || currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                                            <button title="Xóa tin nhắn" onClick={() => handleDelete(msg.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-slate-300 pt-1 pb-1 w-full wrap-break-word whitespace-pre-wrap">
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-indigo-900/40 bg-slate-900/50 shrink-0">
                <div className="flex items-end gap-2">
                    <textarea 
                        value={messageInput} 
                        onChange={e => setMessageInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        rows={2} 
                        placeholder="Nhập câu hỏi của bạn..."
                        disabled={sending}
                        className="flex-1 bg-[#010816] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none disabled:opacity-50" 
                    />
                    <Button onClick={handleSend} disabled={sending || !messageInput.trim()} size="icon" className="size-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-colors shrink-0">
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                    </Button>
                </div>
                </div>
            </div>
        </>
    );
}
