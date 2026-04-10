"use client";

import Link from "next/link";
import { useState } from "react";
import { Code2, UserPlus, Lock, ArrowRight, Loader2, Mail, Calendar, Hash, GraduationCap, Eye, EyeOff } from "lucide-react";
import { signUp } from "@/features/auth/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";

export default function RegisterPage() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (password !== confirmPw) {
            setError("Mật khẩu xác nhận không khớp.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData(e.currentTarget);
            const studentId = formData.get('student_id') as string;
            const emailVal = formData.get('email') as string;
            if (!emailVal && studentId) {
                formData.set('email', `${studentId.toLowerCase()}@student.codemastery.vn`);
            }

            const result = await signUp(formData);

            if (result?.error) {
                const msg = result.error;
                if (msg.includes("already registered")) {
                    setError("Email này đã được đăng ký. Vui lòng đăng nhập hoặc đặt lại mật khẩu.");
                } else {
                    setError(msg);
                }
            } else if (result?.success) {
                setSuccess(result.success || "Đăng ký thành công!");
                setTimeout(() => router.push("/auth/login"), 3000);
            }
        } catch (err: any) {
            setError(err.message || "Đã có lỗi xảy ra khi kết nối. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }

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
        <div className="min-h-screen bg-navy-950 flex font-sans antialiased text-slate-200">
            {/* ─── LEFT: BRANDING (SPLIT LAYOUT) ─── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 lg:p-20 border-r border-slate-800/60 bg-navy-900">
                <div className="absolute inset-0 pointer-events-none bg-[size:24px_24px] bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] pointer-events-none" />
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-900/20 group-hover:bg-indigo-500/20 transition-all">
                            <Code2 className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-100 transition-colors">
                            Code<span className="text-indigo-500">Mastery</span>
                        </span>
                    </Link>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="relative z-10 max-w-md"
                >
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                        Kiến tạo sự nghiệp <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-400">ngay hôm nay.</span>
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed font-light">
                        Một tài khoản, hàng tá dự án thực tế. Nắm bắt cơ hội để làm chủ công nghệ và tỏa sáng với tư cách kỹ sư phần mềm chuyên nghiệp.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`size-8 rounded-full border-2 border-navy-900 bg-gradient-to-br from-amber-${i*2}00 to-amber-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                                   DEV
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500">
                            Cộng đồng lập trình viên Việt Nam
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* ─── RIGHT: REGISTER FORM ─── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative overflow-y-auto min-h-screen">
                <div className="absolute top-6 right-6 z-10">
                    <ThemeToggle />
                </div>
                <div className="absolute top-1/4 left-0 w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none lg:hidden" />

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="w-full max-w-md my-auto pb-10 pt-8"
                >
                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Tạo tài khoản mới</h1>
                        <p className="text-slate-400 text-sm">Điền thông tin định danh sinh viên để bắt đầu.</p>
                    </div>

                    <div className="flex border-b border-slate-800 mb-8 w-full">
                        <Link href="/auth/login" className="flex-1 pb-3 text-center text-sm font-medium text-slate-500 hover:text-slate-300 border-b-2 border-transparent transition-all flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" />
                            Đăng nhập
                        </Link>
                        <div className="flex-1 pb-3 text-center text-sm font-semibold text-indigo-400 border-b-2 border-indigo-500 cursor-default flex items-center justify-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            Đăng ký
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center shadow-lg shadow-red-500/5"
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium text-center shadow-lg shadow-green-500/5"
                            >
                                {success}
                            </motion.div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Họ và tên</label>
                            <div className="relative group">
                                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input name="full_name" type="text" required placeholder="Nguyễn Văn A"
                                    className="w-full bg-navy-900/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium backdrop-blur-xl outline-none" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-px bg-slate-900 rounded-[11px] bg-linear-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input name="email" type="email" required placeholder="email@example.com"
                                    className="w-full bg-navy-900/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium backdrop-blur-xl outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ngày sinh</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input name="date_of_birth" type="date" required
                                        className="w-full bg-navy-900/50 border border-slate-700/50 rounded-xl py-3 pl-9 pr-2 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium backdrop-blur-xl outline-none [color-scheme:dark] text-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mã lớp</label>
                                <div className="relative group">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input name="class_code" type="text" required placeholder="2305HTTA"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-9 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm scheme-dark" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mã sinh viên</label>
                            <div className="relative group">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input name="student_id" type="text" required placeholder="2305HTTA001"
                                    className="w-full bg-navy-900/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium uppercase backdrop-blur-xl outline-none" />
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    name="password"
                                    type={showPw ? "text" : "password"}
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                                    className="w-full bg-navy-900/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium backdrop-blur-xl outline-none"
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors outline-none">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            
                            {/* Password strength indicator */}
                            {password && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mt-2 px-1">
                                    <div className="flex gap-1.5 flex-1">
                                        {[1, 2, 3, 4].map(level => (
                                            <div key={level} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${level <= strength ? strengthColors[strength - 1] : 'bg-slate-800'}`} />
                                        ))}
                                    </div>
                                    <span className={`text-[11px] font-bold tracking-wide w-20 text-right ${strength <= 1 ? 'text-red-400' : strength <= 2 ? 'text-yellow-400' : strength <= 3 ? 'text-blue-400' : 'text-green-400'}`}>
                                        {strengthLabels[strength - 1]}
                                    </span>
                                </motion.div>
                            )}
                        </div>

                        <div className="space-y-1.5 pb-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Xác nhận mật khẩu</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={confirmPw}
                                    onChange={e => setConfirmPw(e.target.value)}
                                    placeholder="Nhập lại mật khẩu"
                                    className="w-full bg-navy-900/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium backdrop-blur-xl outline-none"
                                />
                            </div>
                            {confirmPw && password !== confirmPw && (
                                <p className="text-[11px] font-medium text-red-400 ml-1 pt-1">Mật khẩu không khớp!</p>
                            )}
                        </div>
                        <div className="pt-2 relative group">
                            <div className="absolute -inset-0.5 bg-linear-to-br from-indigo-500 to-purple-500 rounded-[14px] opacity-0 group-hover:opacity-20 blur transition-all duration-300 pointer-events-none"></div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-[#fff] font-bold py-5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-500/20"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Tạo Tài Khoản</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 duration-300" />
                                    </>
                                )}
                            </Button>
                        </div>
                        <p className="text-center text-xs text-slate-500 mt-6 font-medium">
                            Bằng cách đăng ký, bạn đồng ý với{" "}
                            <Link href="#" className="text-indigo-400 hover:text-amber-400 transition-colors">Điều khoản</Link>
                            {" "}và{" "}
                            <Link href="#" className="text-indigo-400 hover:text-amber-400 transition-colors">Chính sách</Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
