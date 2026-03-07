"use client";

import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { useState } from "react";
import { Save, Loader2, Globe, Bell, Shield, Database } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const TABS = [
    { id: 'general', label: 'Tổng quát', icon: Globe },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'system', label: 'Hệ thống', icon: Database },
] as const;

type TabId = typeof TABS[number]['id'];

const TOGGLE_SETTINGS = [
    { key: 'allow_registration', label: 'Cho phép đăng ký mới', desc: 'Người dùng có thể tự đăng ký tài khoản' },
    { key: 'require_email_verify', label: 'Yêu cầu xác thực email', desc: 'Bắt buộc xác thực email khi đăng ký' },
    { key: 'maintenance_mode', label: 'Chế độ bảo trì', desc: 'Chỉ admin có thể truy cập hệ thống' },
    { key: 'email_notifications', label: 'Email thông báo hệ thống', desc: 'Gửi email tự động khi có sự kiện quan trọng' },
];

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [toggles, setToggles] = useState(Object.fromEntries(TOGGLE_SETTINGS.map(s => [s.key, s.key !== 'maintenance_mode'])));

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 900));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <AdminLayout title="Cài đặt Hệ thống" subtitle="Quản lý cấu hình toàn hệ thống">
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
                                <h3 className="font-bold text-white">Thông tin hệ thống</h3>
                                <p className="text-slate-400 text-sm mt-1">Cấu hình chung cho nền tảng CodeMastery</p>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {[
                                        { label: 'Tên hệ thống', defaultValue: 'CodeMastery' },
                                        { label: 'URL hệ thống', defaultValue: 'https://codemastery.vn' },
                                        { label: 'Email liên hệ', defaultValue: 'admin@codemastery.vn' },
                                        { label: 'Số lượng tối đa / lớp', defaultValue: '50' },
                                    ].map(f => (
                                        <div key={f.label} className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{f.label}</label>
                                            <input defaultValue={f.defaultValue}
                                                className="w-full bg-[#010816] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
                                        </div>
                                    ))}
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

                    {(activeTab === 'security' || activeTab === 'notifications' || activeTab === 'system') && (
                        <div className="bg-[#0B1120] border border-indigo-900/30 rounded-2xl p-6 space-y-4">
                            <div className="mb-2">
                                <h3 className="font-bold text-white">{activeTab === 'security' ? 'Bảo mật hệ thống' : activeTab === 'notifications' ? 'Thông báo hệ thống' : 'Cài đặt hệ thống'}</h3>
                                <p className="text-slate-400 text-sm mt-1">Quản lý cấu hình {activeTab === 'security' ? 'bảo mật' : activeTab === 'notifications' ? 'thông báo' : 'nâng cao'}</p>
                            </div>
                            {TOGGLE_SETTINGS.filter(s => {
                                if (activeTab === 'security') return ['allow_registration', 'require_email_verify'].includes(s.key);
                                if (activeTab === 'notifications') return s.key === 'email_notifications';
                                return s.key === 'maintenance_mode';
                            }).map(({ key, label, desc }) => (
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
                </div>
            </div>
        </AdminLayout>
    );
}
