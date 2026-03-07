'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, CheckCircle, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showPw, setShowPw] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if (password !== confirm) {
            setError('Mật khẩu không khớp');
            return;
        }

        setLoading(true);

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
            setTimeout(() => router.push('/auth/login'), 3000);
        }
        setLoading(false);
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#010816] flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="w-full max-w-[480px] bg-gray-900 rounded-2xl shadow-2xl border border-indigo-900/50 overflow-hidden z-10">
                    <div className="h-1 w-full bg-linear-to-r from-indigo-700 via-indigo-600 to-amber-500" />
                    <div className="p-10 text-center">
                        <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-5">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Đặt lại thành công!</h2>
                        <p className="text-sm text-slate-400">Đang chuyển hướng đến trang đăng nhập...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#010816] flex items-center justify-center p-4 relative overflow-hidden font-sans antialiased">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[480px] relative z-10">
                <Link href="/auth/login" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
                </Link>

                <div className="bg-gray-900 rounded-2xl shadow-2xl border border-indigo-900/50 overflow-hidden">
                    <div className="h-1 w-full bg-linear-to-r from-indigo-700 via-indigo-600 to-amber-500" />

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="size-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
                                <Lock className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Đặt lại mật khẩu</h2>
                            <p className="text-sm text-slate-400">Nhập mật khẩu mới cho tài khoản của bạn</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu mới</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-3 pl-10 pr-10 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                                        placeholder="Ít nhất 6 ký tự"
                                    />
                                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Xác nhận mật khẩu</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="password"
                                        value={confirm}
                                        onChange={e => setConfirm(e.target.value)}
                                        required
                                        className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                                        placeholder="Nhập lại mật khẩu"
                                    />
                                </div>
                                {confirm && password !== confirm && (
                                    <p className="text-xs text-red-400 ml-1">Mật khẩu không khớp</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-indigo-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đặt lại mật khẩu'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
