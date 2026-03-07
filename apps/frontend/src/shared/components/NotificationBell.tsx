'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface Notification {
    id: string;
    title: string;
    body?: string;
    type: string;
    is_read: boolean;
    link_url?: string;
    created_at: string;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    async function getToken() {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token ?? '';
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function fetchNotifications() {
        const token = await getToken();
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications ?? []);
                setUnreadCount(data.unreadCount ?? 0);
            }
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    }

    async function markAsRead(id: string) {
        const token = await getToken();
        try {
            await fetch(`${API_URL}/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    }

    async function markAllAsRead() {
        setLoading(true);
        const token = await getToken();
        try {
            await fetch(`${API_URL}/api/notifications/read-all`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
        setLoading(false);
    }

    async function deleteNotification(id: string) {
        const token = await getToken();
        try {
            await fetch(`${API_URL}/api/notifications/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Failed to delete notification', err);
        }
    }

    function formatTime(dateStr: string) {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} giờ trước`;
        const days = Math.floor(hours / 24);
        return `${days} ngày trước`;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-slate-800 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                        <h3 className="text-sm font-semibold text-white">Thông báo</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    disabled={loading}
                                    className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                >
                                    <CheckCheck className="w-3 h-3" /> Đọc tất cả
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="py-8 text-center text-sm text-slate-500">
                                Không có thông báo nào
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`px-4 py-3 border-b border-slate-800/50 hover:bg-white/5 transition-colors ${!notification.is_read ? 'bg-indigo-500/5' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!notification.is_read ? 'bg-indigo-400' : 'bg-transparent'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-medium truncate">{notification.title}</p>
                                            {notification.body && (
                                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notification.body}</p>
                                            )}
                                            <p className="text-[10px] text-slate-500 mt-1">{formatTime(notification.created_at)}</p>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            {!notification.is_read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="p-1 text-slate-500 hover:text-indigo-400 transition-colors"
                                                    title="Đánh dấu đã đọc"
                                                >
                                                    <Check className="w-3 h-3" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
