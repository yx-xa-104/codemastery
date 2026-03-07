"use client";

import { TeacherLayout } from "@/features/teacher/components/TeacherLayout";
import { useState } from "react";
import { Save, Loader2, Bell, Shield, Globe, Palette } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const TABS = [
    { id: 'general', label: 'Thông tin chung', icon: Globe },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'appearance', label: 'Giao diện', icon: Palette },
] as const;

type TabId = typeof TABS[number]['id'];

const TOGGLE_SETTINGS = [
    { key: 'email_new_enroll', label: 'Email khi có học viên mới đăng ký', desc: 'Nhận email mỗi khi có người đăng ký vào khóa học của bạn' },
    { key: 'email_new_question', label: 'Email khi có câu hỏi mới', desc: 'Nhận thông báo khi học viên đặt câu hỏi' },
    { key: 'email_weekly_report', label: 'Báo cáo hàng tuần', desc: 'Tóm tắt hoạt động mỗi thứ Hai' },
    { key: 'push_messages', label: 'Thông báo tin nhắn', desc: 'Nhận push notification khi có tin nhắn mới' },
];

export default function TeacherSettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [toggles, setToggles] = useState(Object.fromEntries(TOGGLE_SETTINGS.map(s => [s.key, true])));

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 900));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <TeacherLayout title="Cài đặt" subtitle="Quản lý tài khoản và tùy chọn giảng viên">
            <div className="flex flex-col lg:flex-row gap-6">
                <nav className="lg:w-48 flex flex-row lg:flex-col gap-1 overflow-x-auto shrink-0">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <Button variant="ghost" key={id} onClick={() => setActiveTab(id)}
                            className={`flex justify-start items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                        </Button>
                    ))}
                </nav>

                <div className="flex-1">
                    {activeTab === 'general' && (
                        <div className="bg-[#0B1120] border border-indigo-900/30 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-indigo-900/30">
                                <h3 className="font-bold text-white">Thông tin giảng viên</h3>
                                <p className="text-slate-400 text-sm mt-1">Cập nhật thông tin hiển thị của bạn</p>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {[
                                        { label: 'Họ và tên', placeholder: 'Nguyễn Văn A', defaultValue: '' },
                                        { label: 'Tiêu đề', placeholder: 'Giảng viên cao cấp', defaultValue: '' },
                                        { label: 'Email', placeholder: 'email@example.com', defaultValue: '' },
                                        { label: 'Số điện thoại', placeholder: '0901234567', defaultValue: '' },
                                    ].map(f => (
                                        <div key={f.label} className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{f.label}</label>
                                            <input defaultValue={f.defaultValue} placeholder={f.placeholder}
                                                className="w-full bg-[#010816] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Giới thiệu</label>
                                    <textarea rows={3} placeholder="Giới thiệu về bản thân và kinh nghiệm giảng dạy..."
                                        className="w-full bg-[#010816] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none" />
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={handleSave} disabled={saving}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${saved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'} disabled:opacity-50`}>
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {saved ? 'Đã lưu!' : 'Lưu thay đổi'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-[#0B1120] border border-indigo-900/30 rounded-2xl p-6 space-y-4">
                            <div className="mb-2">
                                <h3 className="font-bold text-white">Tùy chọn thông báo</h3>
                                <p className="text-slate-400 text-sm mt-1">Quản lý cách bạn nhận thông báo</p>
                            </div>
                            {TOGGLE_SETTINGS.map(({ key, label, desc }) => (
                                <div key={key} className="flex items-center justify-between p-4 bg-[#010816] rounded-xl border border-indigo-900/30">
                                    <div>
                                        <p className="text-sm font-medium text-white">{label}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                                    </div>
                                    <button onClick={() => setToggles(t => ({ ...t, [key]: !t[key] }))}
                                        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-4 cursor-pointer border-0 ${toggles[key] ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                        <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${toggles[key] ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-[#0B1120] border border-indigo-900/30 rounded-2xl p-6 space-y-5">
                            <div>
                                <h3 className="font-bold text-white">Đổi mật khẩu</h3>
                                <p className="text-slate-400 text-sm mt-1">Cập nhật mật khẩu để bảo vệ tài khoản</p>
                            </div>
                            {['Mật khẩu hiện tại', 'Mật khẩu mới', 'Xác nhận mật khẩu mới'].map(l => (
                                <div key={l} className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{l}</label>
                                    <input type="password" placeholder="••••••••"
                                        className="w-full bg-[#010816] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 transition-all text-sm" />
                                </div>
                            ))}
                            <div className="flex justify-end">
                                <Button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">Cập nhật mật khẩu</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="bg-[#0B1120] border border-indigo-900/30 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4">Giao diện</h3>
                            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                                <p className="text-amber-300 text-sm">Tùy chọn giao diện sẽ sớm ra mắt.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
