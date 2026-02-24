"use client";

import { MainLayout } from "@/components/layouts/MainLayout";
import { User, Mail, Shield, Bell, CreditCard, LogOut, Camera, Save } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AccountSettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", name: "Hồ sơ cá nhân", icon: User },
        { id: "security", name: "Bảo mật", icon: Shield },
        { id: "notifications", name: "Thông báo", icon: Bell },
        { id: "billing", name: "Thanh toán", icon: CreditCard },
    ];

    return (
        <MainLayout>
            <div className="min-h-screen bg-navy-950/50 py-12 relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Cài đặt Tài khoản</h1>
                        <p className="text-slate-400">Quản lý thông tin cá nhân và tùy chọn bảo mật của bạn.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <div className="w-full md:w-64 flex-shrink-0">
                            <div className="glass rounded-2xl p-3 border border-slate-800/80 sticky top-24">
                                <nav className="space-y-1">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive
                                                        ? "bg-indigo-600/20 text-indigo-400 border py-3 border-indigo-500/30"
                                                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                                    }`}
                                            >
                                                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                                                {tab.name}
                                            </button>
                                        );
                                    })}
                                    <hr className="border-slate-800/80 my-4 mx-2" />
                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20">
                                        <LogOut className="w-5 h-5 opacity-80" />
                                        Đăng xuất
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="glass rounded-2xl border border-slate-800/80 overflow-hidden"
                            >
                                {activeTab === "profile" && (
                                    <div>
                                        <div className="p-6 md:p-8 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                            <div className="relative group">
                                                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden relative">
                                                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Avatar" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex flex-col items-center justify-center cursor-pointer transition-all">
                                                        <Camera className="w-6 h-6 text-white mb-1" />
                                                        <span className="text-[10px] text-white">Thay đổi</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-white mb-1">Nguyễn Văn A</h2>
                                                <p className="text-slate-400 text-sm flex items-center gap-2">
                                                    <Mail className="w-4 h-4" /> nguyen.vana@example.com
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-6 md:p-8 space-y-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">Thông tin cơ bản</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-400">Họ và tên</label>
                                                    <input type="text" defaultValue="Nguyễn Văn A" className="w-full bg-navy-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-400">Tên hiển thị (Username)</label>
                                                    <input type="text" defaultValue="vana.nguyen" className="w-full bg-navy-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-400">Chức danh</label>
                                                    <input type="text" defaultValue="Frontend Developer" className="w-full bg-navy-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-400">Kinh nghiệm</label>
                                                    <select className="w-full bg-navy-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium appearance-none">
                                                        <option value="1">Dưới 1 năm</option>
                                                        <option value="2">1 - 3 năm</option>
                                                        <option value="3">3 - 5 năm</option>
                                                        <option value="4">Trên 5 năm</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-sm font-medium text-slate-400">Giới thiệu ngắn (Bio)</label>
                                                    <textarea rows={4} defaultValue="Đam mê lập trình web, yêu thích thiết kế giao diện sáng tạo và trải nghiệm người dùng." className="w-full bg-navy-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium resize-none"></textarea>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-slate-800/80 flex justify-end">
                                                <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-glow-indigo flex items-center gap-2">
                                                    <Save className="w-4 h-4" />
                                                    Lưu thay đổi
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab !== "profile" && (
                                    <div className="p-12 flex flex-col items-center justify-center text-center opacity-60">
                                        <Shield className="w-16 h-16 text-slate-600 mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">Tính năng đang phát triển</h3>
                                        <p className="text-slate-400">Phần cấu hình này sẽ sớm được ra mắt trong bản cập nhật tới.</p>
                                    </div>
                                )}

                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
