"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Code2, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { signInWithPassword } from "@/app/auth/actions";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await signInWithPassword(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // On success, server action redirects to /dashboard
    }

    return (
        <div className="min-h-screen bg-[#010816] flex items-center justify-center p-4 relative overflow-hidden font-sans antialiased">
            {/* Background blurs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[480px] bg-gray-900 rounded-2xl shadow-2xl border border-indigo-900/50 relative overflow-hidden z-10">
                {/* Top gradient bar */}
                <div className="h-1 w-full bg-linear-to-r from-indigo-700 via-indigo-600 to-amber-500" />

                {/* Header */}
                <div className="pt-10 pb-6 text-center px-6">
                    <Link href="/" className="inline-flex justify-center mb-5">
                        <div className="size-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-900/20">
                            <Code2 className="w-8 h-8 text-indigo-500" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        Code<span className="text-indigo-500">Mastery</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Nền tảng học lập trình trực tuyến miễn phí</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 mx-8 mb-8">
                    <div className="flex-1 pb-3 text-center text-sm font-medium text-indigo-400 border-b-2 border-indigo-600 cursor-default flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        Đăng nhập
                    </div>
                    <Link href="/auth/register" className="flex-1 pb-3 text-center text-sm font-medium text-gray-500 hover:text-gray-300 border-b-2 border-transparent transition-all flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" />
                        Đăng ký
                    </Link>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                            Email hoặc Mã SV
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                name="email"
                                type="text"
                                required
                                placeholder="Nhập email hoặc mã sinh viên"
                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mật khẩu</label>
                            <Link href="#" className="text-xs text-indigo-400 hover:text-amber-500 transition-colors">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/20 mt-2 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>Truy cập ngay</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    {/* Teacher info box */}
                    <div className="mt-8 p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex gap-3 items-start">
                        <Code2 className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-white">Dành cho Giảng viên</p>
                            <p className="text-xs text-indigo-200/70 leading-relaxed">
                                Tài khoản giảng viên được cấp riêng. Vui lòng liên hệ ban quản trị nhà trường để nhận thông tin đăng nhập.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
