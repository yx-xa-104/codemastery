"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Code2, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { signInWithPassword } from "@/features/auth/actions";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/client";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";

export default function LoginPage() {
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();
    const [showPw, setShowPw] = useState(false);
    const router = useRouter();

    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        try {
            setError("");
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });
            if (error) throw error;
        } catch (err: any) {
            console.error("[OAuth Error]", err);
            setError(err.message || "Không thể kết nối đến máy chủ đăng nhập.");
        }
    };

    function formAction(formData: FormData) {
        if (isPending) return;
        setError("");

        const emailVal = formData.get("email") as string;
        if (emailVal && !emailVal.includes("@")) {
            formData.set("email", `${emailVal.toLowerCase()}@student.codemastery.vn`);
        }

        startTransition(async () => {
            try {
                const result = await signInWithPassword(formData);
        
                if (result?.error) {
                    const msg = result.error;
                    if (msg.includes("Invalid login credentials")) {
                        setError("Email hoặc mật khẩu không đúng.");
                    } else if (msg.includes("Email not confirmed")) {
                        setError("Tài khoản chưa được xác nhận. Vui lòng kiểm tra email.");
                    } else {
                        setError(msg);
                    }
                } else if (result?.success && result.redirectPath) {
                    window.location.href = result.redirectPath;
                }
            } catch (err: any) {
                console.error("[Login Client Error]", err);
                setError(err.message || "Đã có lỗi xảy ra khi kết nối đến máy chủ.");
            }
        });
    }

    return (
        <div className="min-h-screen bg-navy-950 flex font-sans antialiased text-slate-200">
            {/* ─── LEFT: BRANDING (SPLIT LAYOUT) ─── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 lg:p-20 border-r border-slate-800/60 bg-navy-900">
                {/* Abstract grid & glow */}
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
                        Định hình tương lai <br/>
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-amber-400">của bạn.</span>
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed font-light">
                        Tham gia nền tảng học lập trình trực tuyến chuyên nghiệp. Mở khóa tiềm năng công nghệ bằng thực hành trực tiếp và sự hướng dẫn bài bản.
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
                                <div key={i} className={`size-8 rounded-full border-2 border-navy-900 bg-linear-to-br from-indigo-${i*2}00 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                                   SV
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500">
                            Đồng hành cùng +2,000 sinh viên xuất sắc
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* ─── RIGHT: LOGIN FORM ─── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
                <div className="absolute top-6 right-6">
                    <ThemeToggle />
                </div>
                
                {/* Mobile glow */}
                <div className="absolute top-1/4 right-0 w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none lg:hidden" />

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Chào mừng trở lại!</h1>
                        <p className="text-slate-400 text-sm">Đăng nhập để tiếp tục hành trình học tập.</p>
                    </div>

                    <div className="flex border-b border-slate-800 mb-8 w-full">
                        <div className="flex-1 pb-3 text-center text-sm font-semibold text-indigo-400 border-b-2 border-indigo-500 cursor-default flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" />
                            Đăng nhập
                        </div>
                        <Link href="/auth/register" className="flex-1 pb-3 text-center text-sm font-medium text-slate-500 hover:text-slate-300 border-b-2 border-transparent transition-all flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4" />
                            Đăng ký
                        </Link>
                    </div>

                    <form action={formAction} className="space-y-5">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center shadow-lg shadow-red-500/5 overflow-hidden"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                Email hoặc Mã SV
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-px bg-slate-900 rounded-[11px] bg-linear-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    name="email"
                                    type="text"
                                    required
                                    placeholder="Nhập email hoặc mã sinh viên"
                                    className="w-full bg-navy-900/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium backdrop-blur-xl outline-none"
                                />
                            </div>
                            <p className="text-[11px] text-slate-500 ml-1 font-medium pt-1">
                                Sẽ tự động chuyển thành email @student.codemastery.vn nếu chỉ nhập mã SV.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mật khẩu</label>
                                <Link href="/auth/forgot-password" className="text-xs font-semibold text-indigo-400 hover:text-amber-400 transition-colors">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    name="password"
                                    type={showPw ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-navy-900/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium backdrop-blur-xl outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors outline-none"
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 relative group">
                            <div className="absolute -inset-0.5 bg-linear-to-br from-indigo-500 to-purple-500 rounded-[14px] opacity-0 group-hover:opacity-20 blur transition-all duration-300 pointer-events-none"></div>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-[#fff] font-bold py-5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-500/20"
                            >
                                {isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Đăng Nhập</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 duration-300" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* --- OAUTH SEPARATOR --- */}
                        <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-slate-700/60"></div>
                            <span className="px-3 text-[11px] text-slate-500 uppercase tracking-widest font-semibold bg-navy-950">Hoặc tiếp tục với</span>
                            <div className="flex-1 border-t border-slate-700/60"></div>
                        </div>

                        {/* --- OAUTH BUTTONS --- */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => handleOAuthSignIn('google')}
                                className="flex-1 bg-navy-900/40 hover:bg-navy-800/60 text-slate-200 font-semibold py-3.5 px-4 rounded-xl transition-all border border-slate-700/50 hover:border-indigo-500/30 flex items-center justify-center gap-2 group/oauth"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover/oauth:scale-110 transition-transform">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-sm">Google</span>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => handleOAuthSignIn('github')}
                                className="flex-1 bg-navy-900/40 hover:bg-navy-800/60 text-slate-200 font-semibold py-3.5 px-4 rounded-xl transition-all border border-slate-700/50 hover:border-indigo-500/30 flex items-center justify-center gap-2 group/oauth"
                            >
                                <Github className="w-5 h-5 text-slate-200 group-hover/oauth:scale-110 transition-transform" />
                                <span className="text-sm">GitHub</span>
                            </button>
                        </div>

                        <div className="mt-8 p-4 bg-indigo-950/20 border border-indigo-500/10 rounded-xl flex gap-3 items-start backdrop-blur-sm">
                            <Code2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                <strong className="text-slate-200">Dành cho Giảng viên:</strong> Tài khoản giảng viên được cấp độc quyền bởi nhà trường. Vui lòng liên hệ quản trị viên để lấy thông tin.
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
