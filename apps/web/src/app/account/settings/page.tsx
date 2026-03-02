"use client";

import { MainLayout } from "@/components/layouts/MainLayout";
import { useState } from "react";
import { User, Lock, Bell, Shield, Camera, Save, Loader2 } from "lucide-react";

const TABS = [
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'security', label: 'Bảo mật', icon: Lock },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'privacy', label: 'Quyền riêng tư', icon: Shield },
] as const;

type TabId = typeof TABS[number]['id'];

export default function AccountSettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>('profile');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState({
        full_name: '',
        student_id: '',
        class_code: '',
        bio: '',
        date_of_birth: '',
    });

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-[#010816]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white">Cài đặt tài khoản</h1>
                        <p className="text-slate-400 text-sm mt-1">Quản lý hồ sơ và các tùy chọn của bạn</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar nav */}
                        <nav className="lg:w-52 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 lg:overflow-x-visible shrink-0">
                            {TABS.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    {label}
                                </button>
                            ))}
                        </nav>

                        {/* Content */}
                        <div className="flex-1">
                            {activeTab === 'profile' && (
                                <div className="bg-[#111827] rounded-2xl border border-indigo-900/50 overflow-hidden">
                                    {/* Avatar area */}
                                    <div className="p-6 border-b border-indigo-900/30 flex items-center gap-5">
                                        <div className="relative group cursor-pointer">
                                            <div className="size-20 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold border-4 border-indigo-500/30">
                                                U
                                            </div>
                                            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Camera className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">Ảnh đại diện</p>
                                            <p className="text-slate-400 text-sm mt-1">JPG, PNG. Tối đa 2MB</p>
                                            <button className="mt-2 text-xs text-indigo-400 hover:text-amber-400 transition-colors font-medium">
                                                Thay đổi ảnh
                                            </button>
                                        </div>
                                    </div>

                                    {/* Form fields */}
                                    <div className="p-6 space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {[
                                                { label: 'Họ và tên', key: 'full_name', placeholder: 'Nguyễn Văn A' },
                                                { label: 'Mã sinh viên', key: 'student_id', placeholder: '2305HTTA001' },
                                                { label: 'Mã lớp', key: 'class_code', placeholder: '2305HTTA' },
                                                { label: 'Ngày sinh', key: 'date_of_birth', placeholder: '', type: 'date' },
                                            ].map(({ label, key, placeholder, type }) => (
                                                <div key={key} className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                                                    <input
                                                        type={type ?? 'text'}
                                                        value={form[key as keyof typeof form]}
                                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                                        placeholder={placeholder}
                                                        className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm [color-scheme:dark]"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giới thiệu</label>
                                            <textarea
                                                rows={3}
                                                value={form.bio}
                                                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                                placeholder="Viết vài dòng về bản thân..."
                                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none"
                                            />
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${saved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'} disabled:opacity-50`}
                                            >
                                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                {saved ? 'Đã lưu!' : 'Lưu thay đổi'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="bg-[#111827] rounded-2xl border border-indigo-900/50 p-6 space-y-6">
                                    <div>
                                        <h3 className="text-white font-bold mb-1">Đổi mật khẩu</h3>
                                        <p className="text-slate-400 text-sm">Cập nhật mật khẩu định kỳ để bảo vệ tài khoản</p>
                                    </div>
                                    {['Mật khẩu hiện tại', 'Mật khẩu mới', 'Xác nhận mật khẩu mới'].map(label => (
                                        <div key={label} className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                            />
                                        </div>
                                    ))}
                                    <div className="flex justify-end">
                                        <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
                                            Cập nhật mật khẩu
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="bg-[#111827] rounded-2xl border border-indigo-900/50 p-6 space-y-4">
                                    <h3 className="text-white font-bold">Tùy chọn thông báo</h3>
                                    {[
                                        { label: 'Thông báo lớp học', desc: 'Bài tập, cập nhật từ giảng viên' },
                                        { label: 'Nhắc nhở học tập', desc: 'Nhắc khi bạn chưa học trong 24h' },
                                        { label: 'Đạt huy hiệu mới', desc: 'Thông báo khi nhận huy hiệu' },
                                        { label: 'Kết quả bài tập', desc: 'Kết quả chấm điểm tự động' },
                                    ].map(({ label, desc }) => (
                                        <div key={label} className="flex items-center justify-between p-4 bg-[#0B1120] rounded-xl border border-indigo-900/30">
                                            <div>
                                                <p className="text-sm font-medium text-white">{label}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                                            </div>
                                            <button className="w-11 h-6 bg-indigo-600 rounded-full relative flex-shrink-0">
                                                <div className="absolute right-1 top-1 size-4 bg-white rounded-full transition-all" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'privacy' && (
                                <div className="bg-[#111827] rounded-2xl border border-indigo-900/50 p-6">
                                    <h3 className="text-white font-bold mb-4">Quyền riêng tư</h3>
                                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                                        <p className="text-amber-300 text-sm">Các tùy chọn quyền riêng tư sẽ sớm ra mắt.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
