"use client";

import Link from "next/link";
import { useState } from "react";
import { Code2, UserPlus, Lock, ArrowRight, Loader2, Mail, Calendar, Hash, GraduationCap, Eye, EyeOff } from "lucide-react";
import { signUp } from "@/app/auth/actions";
import { Button } from "@/shared/components/ui/button";

export default function RegisterPage() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Validate confirm password
        if (password !== confirmPw) {
            setError("Mật khẩu xác nhận không khớp");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            setLoading(false);
            return;
        }

        const formData = new FormData(e.currentTarget);

        // Client-side: auto-generate email from student_id if needed
        const studentId = formData.get('student_id') as string;
        const emailVal = formData.get('email') as string;
        if (!emailVal && studentId) {
            formData.set('email', `${studentId.toLowerCase()}@student.codemastery.vn`);
        }

        const result = await signUp(formData);

        if (result?.error) {
            // Translate common errors
            const msg = result.error;
            if (msg.includes("already registered")) {
                setError("Email này đã được đăng ký. Vui lòng đăng nhập hoặc đặt lại mật khẩu.");
            } else {
                setError(msg);
            }
        } else if (result?.success) {
            setSuccess(result.success);
        }
        setLoading(false);
    }

    // Password strength
    const getStrength = (pw: string) => {
        if (!pw) return 0;
        let s = 0;
        if (pw.length >= 6) s++;
        if (pw.length >= 8) s++;
        if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
        if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
        return s;
    };
    const strength = getStrength(password);
    const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const strengthLabels = ['Yếu', 'Trung bình', 'Khá', 'Mạnh'];

    return (
        <div className="min-h-screen bg-[#010816] flex items-center justify-center p-4 relative overflow-hidden font-sans antialiased">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[480px] bg-gray-900 rounded-2xl shadow-2xl border border-indigo-900/50 relative overflow-hidden z-10">
                <div className="h-1 w-full bg-linear-to-r from-indigo-700 via-indigo-600 to-amber-500" />

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
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Họ và tên</label>
                        <div className="relative group">
                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input name="full_name" type="text" required placeholder="Nguyễn Văn A"
                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input name="email" type="email" required placeholder="email@example.com"
                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Ngày sinh</label>
                            <div className="relative group">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                <input name="date_of_birth" type="date"
                                    className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm [color-scheme:dark]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mã lớp</label>
                            <div className="relative group">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                <input name="class_code" type="text" placeholder="2305HTTA"
                                    className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm uppercase font-mono" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mã sinh viên</label>
                        <div className="relative group">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input name="student_id" type="text" placeholder="2305HTTA001"
                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm uppercase font-mono" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                name="password"
                                type={showPw ? "text" : "password"}
                                required
                                minLength={6}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-10 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                            />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {/* Password strength */}
                        {password && (
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-1 flex-1">
                                    {[1, 2, 3, 4].map(level => (
                                        <div key={level} className={`h-1 flex-1 rounded-full transition-colors ${level <= strength ? strengthColors[strength - 1] : 'bg-slate-700'}`} />
                                    ))}
                                </div>
                                <span className={`text-[10px] font-medium ${strength <= 1 ? 'text-red-400' : strength <= 2 ? 'text-yellow-400' : strength <= 3 ? 'text-blue-400' : 'text-green-400'}`}>
                                    {strengthLabels[strength - 1] || ''}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Xác nhận mật khẩu</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="password"
                                required
                                value={confirmPw}
                                onChange={e => setConfirmPw(e.target.value)}
                                placeholder="Nhập lại mật khẩu"
                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                            />
                        </div>
                        {confirmPw && password !== confirmPw && (
                            <p className="text-xs text-red-400 ml-1">Mật khẩu không khớp</p>
                        )}
                    </div>

                    <Button
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
                    </Button>

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
