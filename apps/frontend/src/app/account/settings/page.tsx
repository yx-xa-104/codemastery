"use client";

import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { useEffect, useState, useRef } from "react";
import { User, Lock, Bell, Shield, Camera, Save, Loader2, CheckCircle, Eye, EyeOff, Upload } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";

const TABS = [
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'security', label: 'Bảo mật', icon: Lock },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'privacy', label: 'Quyền riêng tư', icon: Shield },
] as const;

type TabId = typeof TABS[number]['id'];

function getSupabase() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}

async function getToken() {
    const sb = getSupabase();
    const { data } = await sb.auth.getSession();
    return data.session?.access_token || '';
}

export default function AccountSettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>('profile');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        full_name: '',
        student_id: '',
        class_code: '',
        bio: '',
        date_of_birth: '',
    });

    // Change password state
    const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState('');
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);

    // Load profile on mount
    useEffect(() => {
        async function load() {
            const token = await getToken();
            if (!token) return;
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            try {
                const res = await fetch(`${API_URL}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setForm({
                        full_name: data.full_name || '',
                        student_id: data.student_id || '',
                        class_code: data.class_code || '',
                        bio: data.bio || '',
                        date_of_birth: data.date_of_birth || '',
                    });
                    setAvatarUrl(data.avatar_url || null);
                }
            } catch (e) {
                console.error('Failed to load profile', e);
            }
        }
        load();
    }, []);

    // Save profile
    const handleSave = async () => {
        setSaving(true);
        setProfileError('');
        try {
            const token = await getToken();
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            const res = await fetch(`${API_URL}/api/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json();
                setProfileError(data.message || 'Lỗi khi lưu');
            } else {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (e) {
            setProfileError('Không thể kết nối máy chủ');
        }
        setSaving(false);
    };

    // Upload avatar
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setProfileError('Ảnh tối đa 2MB');
            return;
        }

        setUploading(true);
        setProfileError('');
        try {
            const token = await getToken();
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            const fd = new FormData();
            fd.append('file', file);

            const res = await fetch(`${API_URL}/api/profile/avatar`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            if (res.ok) {
                const data = await res.json();
                setAvatarUrl(data.avatar_url);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                const data = await res.json();
                setProfileError(data.message || 'Lỗi upload ảnh');
            }
        } catch (e) {
            setProfileError('Upload thất bại');
        }
        setUploading(false);
    };

    // Change password
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwError('');
        setPwSuccess('');

        if (pwForm.newPw.length < 6) {
            setPwError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }
        if (pwForm.newPw !== pwForm.confirm) {
            setPwError('Mật khẩu xác nhận không khớp');
            return;
        }

        setPwLoading(true);
        try {
            const supabase = getSupabase();

            // Verify current password by re-signing in
            const { data: { session } } = await supabase.auth.getSession();
            const email = session?.user?.email;
            if (!email) {
                setPwError('Không tìm thấy phiên đăng nhập');
                setPwLoading(false);
                return;
            }

            const { error: signInErr } = await supabase.auth.signInWithPassword({
                email,
                password: pwForm.current,
            });
            if (signInErr) {
                setPwError('Mật khẩu hiện tại không đúng');
                setPwLoading(false);
                return;
            }

            // Update password
            const { error } = await supabase.auth.updateUser({ password: pwForm.newPw });
            if (error) {
                setPwError(error.message);
            } else {
                setPwSuccess('Đổi mật khẩu thành công!');
                setPwForm({ current: '', newPw: '', confirm: '' });
                setTimeout(() => setPwSuccess(''), 5000);
            }
        } catch (e) {
            setPwError('Lỗi không xác định');
        }
        setPwLoading(false);
    };

    const initials = form.full_name
        ? form.full_name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    return (
        <MainLayout>
            <div className="min-h-screen bg-[#010816]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white">Cài đặt tài khoản</h1>
                        <p className="text-slate-400 text-sm mt-1">Quản lý hồ sơ và các tùy chọn của bạn</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar nav */}
                        <nav className="lg:w-52 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 lg:overflow-x-visible shrink-0">
                            {TABS.map(({ id, label, icon: Icon }) => (
                                <Button
                                    key={id}
                                    variant="ghost"
                                    onClick={() => setActiveTab(id)}
                                    className={`flex justify-start items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    {label}
                                </Button>
                            ))}
                        </nav>

                        {/* Content */}
                        <div className="flex-1">
                            {activeTab === 'profile' && (
                                <div className="bg-[#111827] rounded-2xl border border-indigo-900/50 overflow-hidden">
                                    {/* Avatar area */}
                                    <div className="p-6 border-b border-indigo-900/30 flex items-center gap-5">
                                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                            {avatarUrl ? (
                                                <img src={avatarUrl} className="size-20 rounded-full object-cover border-4 border-indigo-500/30" alt="" />
                                            ) : (
                                                <div className="size-20 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold border-4 border-indigo-500/30">
                                                    {initials}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                                            </div>
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                                        <div>
                                            <p className="text-white font-semibold">Ảnh đại diện</p>
                                            <p className="text-slate-400 text-sm mt-1">JPG, PNG, WebP. Tối đa 2MB</p>
                                            <Button
                                                variant="link"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="mt-2 text-xs h-auto p-0 text-indigo-400 hover:text-amber-400 transition-colors font-medium"
                                            >
                                                {uploading ? 'Đang tải...' : 'Thay đổi ảnh'}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Form fields */}
                                    <div className="p-6 space-y-5">
                                        {profileError && (
                                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{profileError}</div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {[
                                                { label: 'Họ và tên', key: 'full_name', placeholder: 'Nguyễn Văn A' },
                                                { label: 'Mã sinh viên', key: 'student_id', placeholder: '2305HTTA001' },
                                                { label: 'Mã lớp', key: 'class_code', placeholder: '2305HTTA' },
                                                { label: 'Ngày sinh', key: 'date_of_birth', placeholder: '', type: 'date' },
                                            ].map(({ label, key, placeholder, type }) => (
                                                <div key={key} className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                                                    <input
                                                        type={type ?? 'text'}
                                                        value={form[key as keyof typeof form]}
                                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                                        placeholder={placeholder}
                                                        className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm [color-scheme:dark]"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giới thiệu</label>
                                            <textarea
                                                rows={3}
                                                value={form.bio}
                                                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                                placeholder="Viết vài dòng về bản thân..."
                                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none"
                                            />
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <Button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${saved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'} disabled:opacity-50`}
                                            >
                                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                                {saved ? 'Đã lưu!' : 'Lưu thay đổi'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="bg-[#111827] rounded-2xl border border-indigo-900/50 p-6">
                                    <div className="mb-6">
                                        <h3 className="text-white font-bold mb-1">Đổi mật khẩu</h3>
                                        <p className="text-slate-400 text-sm">Cập nhật mật khẩu định kỳ để bảo vệ tài khoản</p>
                                    </div>

                                    <form onSubmit={handleChangePassword} className="space-y-5">
                                        {pwError && (
                                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{pwError}</div>
                                        )}
                                        {pwSuccess && (
                                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> {pwSuccess}
                                            </div>
                                        )}

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mật khẩu hiện tại</label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPw ? 'text' : 'password'}
                                                    value={pwForm.current}
                                                    onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                                                    required
                                                    placeholder="••••••••"
                                                    className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 px-4 pr-10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                                >
                                                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mật khẩu mới</label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPw ? 'text' : 'password'}
                                                    value={pwForm.newPw}
                                                    onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))}
                                                    required
                                                    minLength={6}
                                                    placeholder="Tối thiểu 6 ký tự"
                                                    className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 px-4 pr-10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPw(!showNewPw)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                                >
                                                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {/* Password strength indicator */}
                                            {pwForm.newPw && (
                                                <div className="flex gap-1 mt-1.5">
                                                    {[1, 2, 3, 4].map(level => {
                                                        const strength = pwForm.newPw.length >= 12 ? 4 : pwForm.newPw.length >= 8 ? 3 : pwForm.newPw.length >= 6 ? 2 : 1;
                                                        return (
                                                            <div
                                                                key={level}
                                                                className={`h-1 flex-1 rounded-full transition-colors ${level <= strength
                                                                    ? strength <= 1 ? 'bg-red-500' : strength <= 2 ? 'bg-yellow-500' : strength <= 3 ? 'bg-blue-500' : 'bg-green-500'
                                                                    : 'bg-slate-700'}`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Xác nhận mật khẩu mới</label>
                                            <input
                                                type="password"
                                                value={pwForm.confirm}
                                                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                                                required
                                                placeholder="Nhập lại mật khẩu mới"
                                                className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                            />
                                            {pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
                                                <p className="text-xs text-red-400 mt-1">Mật khẩu không khớp</p>
                                            )}
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={pwLoading || !pwForm.current || !pwForm.newPw || !pwForm.confirm}
                                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {pwLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                                                Cập nhật mật khẩu
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="bg-[#111827] rounded-2xl border border-indigo-900/50 p-6 space-y-4">
                                    <h3 className="text-white font-bold">Tùy chọn thông báo</h3>
                                    {[
                                        { label: 'Thông báo lớp học', desc: 'Bài tập, cập nhật từ giảng viên' },
                                        { label: 'Nhắc nhở học tập', desc: 'Nhắc khi bạn chưa học trong 24h' },
                                        { label: 'Đạt huy hiệu mới', desc: 'Thông báo khi nhận huy hiệu' },
                                        { label: 'Kết quả bài tập', desc: 'Kết quả chấm điểm tự động' },
                                    ].map(({ label, desc }) => (
                                        <div key={label} className="flex items-center justify-between p-4 bg-[#0B1120] rounded-xl border border-indigo-900/30">
                                            <div>
                                                <p className="text-sm font-medium text-white">{label}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                                            </div>
                                            <button className="w-11 h-6 bg-indigo-600 rounded-full relative shrink-0 cursor-pointer">
                                                <div className="absolute right-1 top-1 size-4 bg-white rounded-full transition-all" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'privacy' && (
                                <div className="bg-[#111827] rounded-2xl border border-indigo-900/50 p-6">
                                    <h3 className="text-white font-bold mb-4">Quyền riêng tư</h3>
                                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                                        <p className="text-amber-300 text-sm">Các tùy chọn quyền riêng tư sẽ sớm ra mắt.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
