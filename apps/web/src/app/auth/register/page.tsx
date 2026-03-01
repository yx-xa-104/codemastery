"use client";

import Link from "next/link";
import { useState } from "react";
import { Code2, UserPlus, Lock, ArrowRight, Loader2, Mail, Calendar, Hash, GraduationCap } from "lucide-react";
import { signUp } from "@/app/auth/actions";

export default function RegisterPage() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const formData = new FormData(e.currentTarget);

        // Client-side: auto-generate email from student_id if needed
        const studentId = formData.get('student_id') as string;
        const emailVal = formData.get('email') as string;
        if (!emailVal && studentId) {
            formData.set('email', `${studentId.toLowerCase()}@student.codemastery.vn`);
        }

        const result = await signUp(formData);

        if (result?.error) {
            setError(result.error);
        } else if (result?.success) {
            setSuccess(result.success);
        }
        setLoading(false);
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
                    <Link href="/auth/login" className="flex-1 pb-3 text-center text-sm font-medium text-gray-500 hover:text-gray-300 border-b-2 border-transparent transition-all flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        Đăng nhập
                    </Link>
                    <div className="flex-1 pb-3 text-center text-sm font-medium text-indigo-400 border-b-2 border-indigo-600 cursor-default flex items-center justify-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Đăng ký
                    </div>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                            {success}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                            Họ và tên
                        </label>
                        <div className="relative group">
                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                name="full_name"
                                type="text"
                                required
                                placeholder="Nguyễn Văn A"
                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                            Email
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="email@example.com"
                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                                Ngày sinh
                            </label>
                            <div className="relative group">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    name="date_of_birth"
                                    type="date"
                                    className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm [color-scheme:dark]"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                                Mã lớp
                            </label>
                            <div className="relative group">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    name="class_code"
                                    type="text"
                                    placeholder="2305HTTA"
                                    className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm uppercase font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                            Mã sinh viên
                        </label>
                        <div className="relative group">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                name="student_id"
                                type="text"
                                placeholder="2305HTTA001"
                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm uppercase font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                            Mật khẩu
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/20 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>Đăng ký tài khoản</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        Bằng cách đăng ký, bạn đồng ý với{" "}
                        <Link href="#" className="text-indigo-400 hover:text-amber-500 underline decoration-indigo-400/30 underline-offset-2">
                            Điều khoản
                        </Link>{" "}
                        và{" "}
                        <Link href="#" className="text-indigo-400 hover:text-amber-500 underline decoration-indigo-400/30 underline-offset-2">
                            Chính sách
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
