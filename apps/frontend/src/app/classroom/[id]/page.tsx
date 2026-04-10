"use client";

import { MainLayout } from "@/shared/components/layouts/MainLayout";
import Link from "next/link";
import { useState } from "react";
import {
    MessageCircle, ThumbsUp, Pin, Users, Video, Bell,
    Image, Code, Link as LinkIcon, Send, MoreHorizontal,
    BookOpen, Trophy, Settings, LayoutDashboard
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Lớp học của tôi', href: '#', icon: BookOpen, active: true },
    { label: 'Bài tập & Dự án', href: '#', icon: Code },
    { label: 'Thành tích', href: '#', icon: Trophy },
    { label: 'Cài đặt', href: '/account/settings', icon: Settings },
];

const MEMBERS_ONLINE = [
    { name: 'Thầy Minh', role: 'Giảng viên', status: 'online', initials: 'TM', color: 'bg-indigo-600' },
    { name: 'Nguyễn Thị Lan', status: 'online' },
    { name: 'Trần Văn Minh', status: 'typing', subtitle: 'Đang gõ...' },
    { name: 'Lê Thu', status: 'away', subtitle: 'Vắng mặt 5p' },
    { name: 'Phạm Anh', status: 'online', initials: 'PA' },
    { name: 'Hoàng Long', status: 'offline', subtitle: 'Offline 2h' },
];

const STATUS_COLORS: Record<string, string> = {
    online: 'bg-green-500',
    typing: 'bg-amber-500',
    away: 'bg-yellow-500',
    offline: 'bg-slate-500',
};

const MOCK_POSTS = [
    {
        id: '1',
        author: 'CodeMastery AI',
        role: 'System',
        timeAgo: '15 phút trước',
        isSystem: true,
        content: 'Bài tập thực hành "Xây dựng Landing Page với Flexbox" đã được cập nhật thêm 3 test cases mới để kiểm tra độ tương thích trên mobile. Các bạn vui lòng kiểm tra lại code của mình nhé!',
        likes: 24,
        comments: 5,
    },
    {
        id: '2',
        author: 'Hoàng Nam',
        role: 'Học viên',
        timeAgo: '45 phút trước',
        content: 'Mọi người ơi cho mình hỏi xíu, mình đang làm cái navbar nhưng khi thu nhỏ màn hình thì menu nó bị vỡ layout. Có ai biết cách fix không ạ? Mình dùng Grid.',
        likes: 2,
        comments: 3,
    },
];

interface MemberProps { name: string; role?: string; status: string; subtitle?: string; initials?: string; color?: string; }

function MemberItem({ name, role, status, subtitle, initials, color }: MemberProps) {
    return (
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="relative">
                <div className={`size-9 rounded-full flex items-center justify-center text-white text-xs font-bold border border-slate-700 ${color ?? 'bg-slate-700'}`}>
                    {initials ?? name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <span className={`absolute bottom-0 right-0 size-2.5 border-2 border-[#0B1120] rounded-full ${STATUS_COLORS[status]}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white">
                    {name} {role && <span className="text-[10px] bg-indigo-900/60 text-indigo-300 px-1.5 py-0.5 rounded ml-1">{role}</span>}
                </p>
                {subtitle && <p className={`text-[10px] truncate ${status === 'typing' ? 'text-amber-400' : status === 'online' ? 'text-green-400' : 'text-slate-500'}`}>{subtitle}</p>}
                {status === 'online' && !subtitle && <p className="text-[10px] text-green-400">Đang trực tuyến</p>}
            </div>
        </div>
    );
}

export default function ClassroomPage({ params }: { params: { id: string } }) {
    const [postContent, setPostContent] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'homework' | 'discussion'>('all');

    return (
        <div className="flex h-screen bg-navy-950 text-slate-100 overflow-hidden font-sans">
            {/* Left Sidebar Nav */}
            <aside className="w-60 bg-navy-900 border-r border-indigo-900/30 flex-col hidden md:flex">
                <div className="h-16 flex items-center px-5 border-b border-indigo-900/30">
                    <Link href="/" className="text-xl font-bold tracking-tighter text-white">
                        Code<span className="text-indigo-500">Mastery</span>
                    </Link>
                    <span className="ml-2 text-[10px] uppercase tracking-wide bg-indigo-900/50 text-indigo-200 px-1.5 py-0.5 rounded border border-indigo-500/30">Học viên</span>
                </div>
                <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map(({ label, href, icon: Icon, active }) => (
                        <Link key={label} href={href} className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col h-full">
                {/* Header */}
                <header className="h-16 bg-navy-900/80 backdrop-blur-md border-b border-indigo-900/30 flex justify-between items-center px-6 z-20">
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-bold text-white hidden sm:block">Lớp: Lập trình Web Frontend Cơ bản</h2>
                        <span className="text-slate-600 hidden sm:block">|</span>
                        <span className="text-sm text-indigo-400 flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                            Đang diễn ra
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="relative size-9 bg-navy-950 rounded-full border border-slate-700 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 hover:bg-transparent flex items-center justify-center transition-colors">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-0.5 right-1 size-2 bg-red-500 rounded-full" />
                        </Button>
                        <div className="w-px h-6 bg-slate-700" />
                        <Button className="flex items-center gap-2 px-4 py-2 h-auto bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-lg transition-all shadow-md">
                            <Video className="w-4 h-4" />
                            <span className="hidden sm:inline">Vào phòng học</span>
                        </Button>
                    </div>
                </header>

                {/* Body: feed + right sidebar */}
                <main className="flex-1 flex overflow-hidden">
                    {/* Feed */}
                    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                        {/* Pinned announcement */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Pin className="w-4 h-4 text-amber-400 -rotate-45" />
                                <h3 className="text-base font-bold text-white">Ghim quan trọng</h3>
                            </div>
                            <div className="bg-linear-to-r from-indigo-900/40 to-[#0B1120] border border-indigo-500/30 rounded-xl p-6 shadow-lg relative overflow-hidden">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">TM</div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Thầy Minh <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded ml-1">Giảng viên</span></p>
                                            <p className="text-xs text-indigo-300">Đã đăng 2 giờ trước</p>
                                        </div>
                                    </div>
                                    <span className="bg-red-500/10 text-red-400 text-xs font-bold px-2 py-1 rounded border border-red-500/20 uppercase tracking-wide">Quan trọng</span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">Thông báo Lịch thi Giữa kỳ & Nội dung ôn tập</h4>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    Lịch thi giữa kỳ sẽ diễn ra vào <span className="text-amber-400 font-semibold">thứ 6 tuần sau (25/11) lúc 19:30</span>. Nội dung bao gồm: HTML5 Semantic, CSS Flexbox/Grid và JS Basic.
                                </p>
                                <div className="flex gap-3">
                                    {['De_cuong_on_tap.pdf (2.4MB)', 'Link đăng ký nhóm'].map(file => (
                                        <Button variant="outline" key={file} className="flex items-center h-auto gap-2 px-3 py-2 bg-[#111827] hover:bg-slate-700 border-slate-700 hover:text-white rounded-lg text-xs text-slate-300 transition-all">
                                            {file.endsWith('MB)') ? <LinkIcon className="w-3 h-3 text-red-400" /> : <LinkIcon className="w-3 h-3 text-blue-400" />}
                                            {file}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Post composer */}
                        <div className="bg-navy-900 border border-indigo-900/30 rounded-xl p-4 mb-6">
                            <div className="flex gap-3">
                                <div className="size-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">TN</div>
                                <div className="flex-1">
                                    <textarea
                                        value={postContent}
                                        onChange={e => setPostContent(e.target.value)}
                                        className="w-full bg-navy-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                                        placeholder="Chia sẻ thắc mắc hoặc thảo luận với lớp..."
                                        rows={2}
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex gap-3 text-slate-400">
                                            {[Image, Code, LinkIcon].map((Icon, i) => (
                                                <Button variant="ghost" size="icon" key={i} className="hover:text-amber-400 hover:bg-white/5 h-8 w-8 transition-colors border-0">
                                                    <Icon className="w-4 h-4" />
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            disabled={!postContent.trim()}
                                            className="flex items-center h-auto gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            <Send className="w-3 h-3" /> Đăng bài
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-indigo-400" />
                                Bảng tin lớp học
                            </h3>
                            <div className="flex gap-1">
                                {[['all', 'Tất cả'], ['homework', 'Bài tập'], ['discussion', 'Thảo luận']].map(([key, label]) => (
                                    <Button
                                        variant="ghost"
                                        key={key}
                                        onClick={() => setActiveTab(key as typeof activeTab)}
                                        className={`text-xs h-auto font-medium px-3 py-1.5 rounded-full transition-colors border-0 ${activeTab === key ? 'text-white bg-indigo-600 hover:bg-indigo-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Posts */}
                        <div className="space-y-4">
                            {MOCK_POSTS.map(post => (
                                <div key={post.id} className="bg-navy-900 border border-indigo-900/30 rounded-xl p-5 hover:border-indigo-500/30 transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className={`size-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${post.isSystem ? 'bg-linear-to-br from-indigo-600 to-indigo-900' : 'bg-slate-700'}`}>
                                            {post.isSystem ? '🤖' : post.author.split(' ').map(p => p[0]).join('').slice(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="text-sm font-bold text-white">{post.author}</span>
                                                    {post.isSystem && <span className="ml-2 text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 uppercase">System</span>}
                                                    <p className="text-xs text-slate-500">{post.role} • {post.timeAgo}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-white hover:bg-white/5 h-8 w-8 border-0">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">{post.content}</p>
                                            <div className="flex items-center gap-5 mt-4 pt-3 border-t border-slate-800">
                                                <Button variant="ghost" className="flex items-center h-auto px-2 py-1 gap-1.5 text-xs text-slate-400 hover:bg-white/5 border-0 hover:text-amber-400 transition-colors">
                                                    <ThumbsUp className="w-4 h-4" /> {post.likes}
                                                </Button>
                                                <Button variant="ghost" className="flex items-center h-auto px-2 py-1 gap-1.5 text-xs text-slate-400 hover:bg-white/5 border-0 hover:text-white transition-colors">
                                                    <MessageCircle className="w-4 h-4" /> {post.comments} bình luận
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Member list */}
                    <aside className="w-64 bg-navy-900 border-l border-indigo-900/30 flex-col hidden lg:flex">
                        <div className="p-4 border-b border-indigo-900/30">
                            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-green-400" />
                                Danh sách lớp học
                                <span className="text-xs font-normal text-slate-500 ml-auto">32 thành viên</span>
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Giảng viên</h4>
                                {MEMBERS_ONLINE.filter(m => m.role === 'Giảng viên').map(m => <MemberItem key={m.name} {...m} />)}
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Học viên trực tuyến (12)</h4>
                                {MEMBERS_ONLINE.filter(m => m.role !== 'Giảng viên').map(m => <MemberItem key={m.name} {...m} />)}
                            </div>
                            <Button variant="outline" className="w-full h-auto text-center text-xs text-slate-500 hover:text-indigo-400 py-2 border-dashed border-slate-800 rounded hover:bg-transparent hover:border-indigo-500/30 bg-transparent transition-colors">
                                Xem tất cả thành viên
                            </Button>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
}
