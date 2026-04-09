"use client";

import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { useState, useEffect } from "react";
import { Users, Search, Shield, ShieldCheck, ShieldAlert, MoreVertical, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";

type UserProfile = {
    id: string;
    email: string;
    full_name: string | null;
    student_id: string | null;
    avatar_url: string | null;
    role: string;
    created_at: string;
    is_locked: boolean;
};

const ROLE_MAP: Record<string, { label: string; color: string; icon: typeof Shield }> = {
    admin: { label: 'Admin', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: ShieldAlert },
    teacher: { label: 'Giảng viên', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: ShieldCheck },
    student: { label: 'Học viên', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', icon: Shield },
};

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

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [actionMenu, setActionMenu] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [success, setSuccess] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setUsers(await res.json());
            }
        } catch (e) {
            console.error('Failed to fetch users', e);
        }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    const changeRole = async (userId: string, newRole: string) => {
        setActionLoading(userId);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ role: newRole }),
            });
            if (res.ok) {
                setSuccess(`Đã đổi vai trò thành ${ROLE_MAP[newRole]?.label}`);
                setTimeout(() => setSuccess(''), 3000);
                fetchUsers();
            }
        } catch (e) {
            console.error('Failed to change role', e);
        }
        setActionLoading(null);
        setActionMenu(null);
    };

    const toggleLock = async (userId: string, lock: boolean) => {
        setActionLoading(userId);
        try {
            const token = await getToken();
            await fetch(`${API_URL}/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ locked: lock }),
            });
            setSuccess(lock ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
            setTimeout(() => setSuccess(''), 3000);
            fetchUsers();
        } catch (e) {
            console.error('Failed to toggle lock', e);
        }
        setActionLoading(null);
        setActionMenu(null);
    };

    const resetPassword = async (userId: string) => {
        if (!confirm('Bạn có chắc muốn reset mật khẩu tài khoản này về mặc định (CodeMastery@123)?')) return;
        setActionLoading(userId);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/admin/users/${userId}/reset-password`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setSuccess(`Đã reset mật khẩu thành công. Mật khẩu mới: ${data.defaultPassword}`);
            } else {
                setSuccess('Lỗi khi reset mật khẩu');
            }
            setTimeout(() => setSuccess(''), 5000);
        } catch (e) {
            console.error('Failed to reset password', e);
            setSuccess('Lỗi kết nối server');
            setTimeout(() => setSuccess(''), 3000);
        }
        setActionLoading(null);
        setActionMenu(null);
    };

    const filtered = users.filter(u =>
        (!roleFilter || u.role === roleFilter) &&
        (!search || (u.full_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (u.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (u.student_id?.toLowerCase() || '').includes(search.toLowerCase()))
    );

    const stats = {
        total: users.length,
        students: users.filter(u => u.role === 'student').length,
        teachers: users.filter(u => u.role === 'teacher').length,
        admins: users.filter(u => u.role === 'admin').length,
    };

    return (
        <AdminLayout title="Quản lý Tài khoản" subtitle={`${stats.total} tài khoản trong hệ thống`}>
            {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> {success}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Tổng', value: stats.total, color: 'text-white bg-slate-800 border-slate-700' },
                    { label: 'Học viên', value: stats.students, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                    { label: 'Giảng viên', value: stats.teachers, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                    { label: 'Admin', value: stats.admins, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                ].map(s => (
                    <div key={s.label} className={`border rounded-xl p-4 text-center ${s.color}`}>
                        <p className="text-2xl font-bold">{s.value}</p>
                        <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-[#0B1120] border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                        placeholder="Tìm tên, email, mã SV..." />
                </div>
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                    className="bg-[#0B1120] border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Tất cả vai trò</option>
                    <option value="student">Học viên</option>
                    <option value="teacher">Giảng viên</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                </div>
            ) : (
                <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-indigo-900/30 bg-[#050C1F]">
                                    <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Tài khoản</th>
                                    <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Vai trò</th>
                                    <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Mã SV/GV</th>
                                    <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Trạng thái</th>
                                    <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Ngày tạo</th>
                                    <th className="px-5 py-3.5 w-16" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-indigo-900/20">
                                {filtered.map(u => {
                                    const roleInfo = ROLE_MAP[u.role] || ROLE_MAP.student;
                                    const RoleIcon = roleInfo.icon;
                                    const initials = (u.full_name || u.email || '?').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                                    const createdDate = new Date(u.created_at).toLocaleDateString('vi-VN');

                                    return (
                                        <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {u.avatar_url ? (
                                                        <img src={u.avatar_url} className="size-9 rounded-full object-cover border border-slate-700" alt="" />
                                                    ) : (
                                                        <div className="size-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">{initials}</div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{u.full_name || 'Chưa đặt tên'}</p>
                                                        <p className="text-xs text-slate-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${roleInfo.color}`}>
                                                    <RoleIcon className="w-3 h-3" /> {roleInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-slate-300 font-mono">{u.student_id || '—'}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                {u.is_locked ? (
                                                    <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">Đã khóa</span>
                                                ) : (
                                                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">Hoạt động</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4"><span className="text-xs text-slate-500">{createdDate}</span></td>
                                            <td className="px-5 py-4 relative">
                                                {actionLoading === u.id ? (
                                                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                                                ) : (
                                                    <div className="relative">
                                                        <Button variant="ghost" size="icon" onClick={() => setActionMenu(actionMenu === u.id ? null : u.id)}
                                                            className="h-8 w-8 text-slate-500 hover:text-white hover:bg-white/5 transition-all bg-transparent border-0">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                        {actionMenu === u.id && (
                                                            <div className="absolute right-0 top-full mt-1 w-48 bg-[#0B1120] border border-slate-700 rounded-lg shadow-xl z-30 py-1 overflow-hidden">
                                                                {u.role !== 'student' && (
                                                                    <button onClick={() => changeRole(u.id, 'student')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">→ Đổi thành Học viên</button>
                                                                )}
                                                                {u.role !== 'teacher' && (
                                                                    <button onClick={() => changeRole(u.id, 'teacher')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">→ Đổi thành Giảng viên</button>
                                                                )}
                                                                {u.role !== 'admin' && (
                                                                    <button onClick={() => changeRole(u.id, 'admin')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">→ Đổi thành Admin</button>
                                                                )}
                                                                <div className="border-t border-slate-700 my-1" />
                                                                {u.is_locked ? (
                                                                    <button onClick={() => toggleLock(u.id, false)} className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-green-500/10">Mở khóa tài khoản</button>
                                                                ) : (
                                                                    <button onClick={() => toggleLock(u.id, true)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">Khóa tài khoản</button>
                                                                )}
                                                                <button onClick={() => resetPassword(u.id)} className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-500/10">Reset mật khẩu</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-16 text-slate-500">
                                            <Users className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                                            Không tìm thấy tài khoản nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
