"use client";

import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { useEffect, useState } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import {
    CheckCircle, XCircle, Ban, Eye, ArrowRightLeft, FolderOpen,
    Loader2, Search, AlertTriangle, Clock, BookOpen
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

type Course = {
    id: string;
    title: string;
    slug: string;
    status: string;
    level: string;
    teacher_id: string;
    category_id: string | null;
    total_enrollments: number;
    created_at: string;
    rejection_reason?: string;
    categories?: { id: string; name: string; slug: string } | null;
};

type Category = { id: string; name: string; slug: string };

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    draft: { label: "Nháp", color: "text-slate-400 bg-slate-500/10 border-slate-500/20", icon: Clock },
    pending_review: { label: "Chờ duyệt", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: Clock },
    published: { label: "Đã duyệt", color: "text-green-400 bg-green-500/10 border-green-500/20", icon: CheckCircle },
    rejected: { label: "Từ chối", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: XCircle },
    suspended: { label: "Đình chỉ", color: "text-orange-400 bg-orange-500/10 border-orange-500/20", icon: Ban },
    archived: { label: "Lưu trữ", color: "text-slate-400 bg-slate-500/10 border-slate-500/20", icon: FolderOpen },
};

const STATUS_FILTERS = ["all", "pending_review", "draft", "published", "rejected", "suspended"];

async function getToken() {
    const sb = createClient();
    const { data } = await sb.auth.getSession();
    return data.session?.access_token || "";
}

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [rejectModal, setRejectModal] = useState<{ courseId: string; title: string } | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [transferModal, setTransferModal] = useState<{ courseId: string; title: string } | null>(null);
    const [transferTeacherId, setTransferTeacherId] = useState("");
    const [categoryModal, setCategoryModal] = useState<{ courseId: string; title: string } | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const fetchCourses = async () => {
        const token = await getToken();
        const url = filter === "all" ? `${API_URL}/api/admin/courses` : `${API_URL}/api/admin/courses?status=${filter}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setCourses(await res.json());
    };

    const fetchCategories = async () => {
        const res = await fetch(`${API_URL}/api/courses/categories`);
        if (res.ok) setCategories(await res.json());
    };

    useEffect(() => {
        Promise.all([fetchCourses(), fetchCategories()]).finally(() => setLoading(false));
    }, [filter]);

    const [error, setError] = useState('');

    const doAction = async (courseId: string, action: string, body?: any) => {
        setActionLoading(courseId);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/admin/courses/${courseId}/${action}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                ...(body ? { body: JSON.stringify(body) } : {}),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                setError(err.message || `Thao tác thất bại (${res.status})`);
                setTimeout(() => setError(''), 4000);
            }
        } catch (e: any) {
            setError(e.message || 'Lỗi kết nối server');
            setTimeout(() => setError(''), 4000);
        }
        await fetchCourses();
        setActionLoading(null);
    };

    const filtered = courses.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
    const counts = courses.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {} as Record<string, number>);

    return (
        <AdminLayout title="Quản lý khóa học" subtitle="Kiểm duyệt, đình chỉ và quản trị khóa học">
            {/* Error toast */}
            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                </div>
            )}
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {[
                    { label: "Chờ duyệt", key: "pending_review", color: "text-amber-400" },
                    { label: "Đã duyệt", key: "published", color: "text-green-400" },
                    { label: "Từ chối", key: "rejected", color: "text-red-400" },
                    { label: "Đình chỉ", key: "suspended", color: "text-orange-400" },
                    { label: "Nháp", key: "draft", color: "text-slate-400" },
                ].map(({ label, key, color }) => (
                    <div key={key} className="bg-[#0B1120] border border-indigo-900/30 rounded-xl p-4 text-center">
                        <p className={`text-2xl font-bold ${color}`}>{counts[key] || 0}</p>
                        <p className="text-xs text-slate-500 mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Filter + Search */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {STATUS_FILTERS.map((s) => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                                filter === s
                                    ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/30"
                                    : "text-slate-400 border-slate-700 hover:border-slate-500"
                            }`}>
                            {s === "all" ? "Tất cả" : STATUS_CONFIG[s]?.label || s}
                            {s !== "all" && counts[s] ? ` (${counts[s]})` : ""}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-xs ml-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm khóa học..."
                        className="w-full pl-9 pr-4 py-2 bg-[#0B1120] border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors" />
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-indigo-400 animate-spin" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                    Không có khóa học nào
                </div>
            ) : (
                <div className="bg-[#0B1120] border border-indigo-900/30 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-indigo-900/30 text-slate-500 text-xs uppercase">
                                    <th className="text-left px-5 py-3">Khóa học</th>
                                    <th className="text-left px-5 py-3">Danh mục</th>
                                    <th className="text-left px-5 py-3">Trạng thái</th>
                                    <th className="text-center px-5 py-3">Học viên</th>
                                    <th className="text-right px-5 py-3">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((c) => {
                                    const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.draft;
                                    const Icon = cfg.icon;
                                    const isLoading = actionLoading === c.id;
                                    return (
                                        <tr key={c.id} className="border-b border-indigo-900/20 hover:bg-indigo-600/5 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="text-white font-medium truncate max-w-[250px]">{c.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{c.level} • {new Date(c.created_at).toLocaleDateString("vi-VN")}</p>
                                                {c.rejection_reason && c.status === "rejected" && (
                                                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" /> {c.rejection_reason}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4"><span className="text-slate-400 text-xs">{c.categories?.name || "—"}</span></td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${cfg.color}`}>
                                                    <Icon className="w-3 h-3" /> {cfg.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center text-slate-300">{c.total_enrollments}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5 justify-end">
                                                    {isLoading ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" /> : (
                                                        <>
                                                            <Link href={`/admin/courses/${c.slug}/preview`} title="Xem trước khóa học"
                                                                className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"><Eye className="w-4 h-4" /></Link>
                                                            {(c.status === "pending_review" || c.status === "draft") && (
                                                                <button onClick={() => doAction(c.id, "approve")} title="Duyệt"
                                                                    className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                                                            )}
                                                            {(c.status === "pending_review" || c.status === "draft") && (
                                                                <button onClick={() => { setRejectModal({ courseId: c.id, title: c.title }); setRejectReason(""); }} title="Từ chối"
                                                                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><XCircle className="w-4 h-4" /></button>
                                                            )}
                                                            {c.status === "published" && (
                                                                <button onClick={() => doAction(c.id, "suspend")} title="Đình chỉ"
                                                                    className="p-1.5 rounded-lg text-orange-400 hover:bg-orange-500/10 transition-colors"><Ban className="w-4 h-4" /></button>
                                                            )}
                                                            {(c.status === "suspended" || c.status === "published") && (
                                                                <button onClick={() => doAction(c.id, "unpublish")} title="Gỡ xuống (về nháp)"
                                                                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-500/10 transition-colors"><Ban className="w-4 h-4" /></button>
                                                            )}
                                                            <button onClick={() => { setTransferModal({ courseId: c.id, title: c.title }); setTransferTeacherId(""); }} title="Chuyển sở hữu"
                                                                className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"><ArrowRightLeft className="w-4 h-4" /></button>
                                                            <button onClick={() => { setCategoryModal({ courseId: c.id, title: c.title }); setSelectedCategory(c.category_id || ""); }} title="Gán danh mục"
                                                                className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"><FolderOpen className="w-4 h-4" /></button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111827] border border-indigo-900/50 rounded-2xl w-full max-w-md p-6">
                        <h3 className="text-white font-bold mb-1">Từ chối khóa học</h3>
                        <p className="text-sm text-slate-400 mb-4 truncate">{rejectModal.title}</p>
                        <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Nhập lý do từ chối..." rows={3}
                            className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 text-sm resize-none focus:border-indigo-500 transition-colors" />
                        <div className="flex gap-3 mt-4 justify-end">
                            <Button variant="ghost" onClick={() => setRejectModal(null)} className="text-slate-400 hover:text-white text-sm">Hủy</Button>
                            <Button onClick={async () => { await doAction(rejectModal.courseId, "reject", { reason: rejectReason || "Không đạt yêu cầu" }); setRejectModal(null); }}
                                disabled={actionLoading === rejectModal.courseId} className="bg-red-600 hover:bg-red-500 text-white text-sm px-4">
                                {actionLoading === rejectModal.courseId ? <Loader2 className="w-4 h-4 animate-spin" /> : "Từ chối"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transfer Modal */}
            {transferModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111827] border border-indigo-900/50 rounded-2xl w-full max-w-md p-6">
                        <h3 className="text-white font-bold mb-1">Chuyển sở hữu khóa học</h3>
                        <p className="text-sm text-slate-400 mb-4 truncate">{transferModal.title}</p>
                        <input value={transferTeacherId} onChange={(e) => setTransferTeacherId(e.target.value)}
                            placeholder="Nhập UUID của giảng viên mới"
                            className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 text-sm focus:border-indigo-500 transition-colors" />
                        <div className="flex gap-3 mt-4 justify-end">
                            <Button variant="ghost" onClick={() => setTransferModal(null)} className="text-slate-400 hover:text-white text-sm">Hủy</Button>
                            <Button onClick={async () => { if (!transferTeacherId.trim()) return; await doAction(transferModal.courseId, "transfer", { new_teacher_id: transferTeacherId.trim() }); setTransferModal(null); }}
                                disabled={!transferTeacherId.trim() || actionLoading === transferModal.courseId} className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4">
                                {actionLoading === transferModal.courseId ? <Loader2 className="w-4 h-4 animate-spin" /> : "Chuyển"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {categoryModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111827] border border-indigo-900/50 rounded-2xl w-full max-w-md p-6">
                        <h3 className="text-white font-bold mb-1">Gán danh mục</h3>
                        <p className="text-sm text-slate-400 mb-4 truncate">{categoryModal.title}</p>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-[#0B1120] border border-indigo-900/50 rounded-lg py-2.5 px-4 text-white text-sm focus:border-indigo-500 transition-colors appearance-none cursor-pointer">
                            <option value="">Chọn danh mục</option>
                            {categories.map((cat) => <option key={cat.id} value={cat.id} className="bg-[#0B1120]">{cat.name}</option>)}
                        </select>
                        <div className="flex gap-3 mt-4 justify-end">
                            <Button variant="ghost" onClick={() => setCategoryModal(null)} className="text-slate-400 hover:text-white text-sm">Hủy</Button>
                            <Button onClick={async () => { if (!selectedCategory) return; await doAction(categoryModal.courseId, "category", { category_id: selectedCategory }); setCategoryModal(null); }}
                                disabled={!selectedCategory || actionLoading === categoryModal.courseId} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4">
                                {actionLoading === categoryModal.courseId ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
