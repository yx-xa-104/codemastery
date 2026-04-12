'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { Mail, ArrowLeft, CheckCircle, Code2, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
        });

        if (error) {
            let errorMsg = error.message;
            if (errorMsg.toLowerCase().includes('rate limit') || errorMsg.toLowerCase().includes('too many requests')) {
                errorMsg = 'Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau ít phút.';
            } else if (errorMsg.toLowerCase().includes('not found')) {
                errorMsg = 'Không tìm thấy tài khoản với email này.';
            }
            setError(errorMsg);
        } else {
            setSent(true);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 relative overflow-hidden font-sans antialiased">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-[480px] relative z-10">
                <Link href="/auth/login" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
                </Link>

                <div className="bg-navy-900 rounded-2xl shadow-2xl border border-indigo-900/50 overflow-hidden">
                    <div className="h-1 w-full bg-linear-to-r from-indigo-700 via-indigo-600 to-amber-500" />

                    {sent ? (
                        <div className="p-10 text-center">
                            <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-5">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Kiểm tra email</h2>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                Chúng tôi đã gửi link đặt lại mật khẩu đến <span className="text-white font-medium">{email}</span>.
                                Vui lòng kiểm tra hộp thư (và cả thư rác).
                            </p>
                            <Link href="/auth/login" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                                ← Quay lại đăng nhập
                            </Link>
                        </div>
                    ) : (
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="size-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
                                    <Mail className="w-7 h-7 text-indigo-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Quên mật khẩu?</h2>
                                <p className="text-sm text-slate-400">Nhập email để nhận link đặt lại mật khẩu</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-navy-900 border border-indigo-900/50 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-[#fff] font-bold rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gửi link đặt lại'}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
