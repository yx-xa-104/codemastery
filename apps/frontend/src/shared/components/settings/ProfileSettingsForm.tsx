"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User, Lock, Camera, Save, Loader2, CheckCircle, Eye, EyeOff,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/client";

async function getToken() {
  const sb = createClient();
  const { data } = await sb.auth.getSession();
  return data.session?.access_token || "";
}

interface ProfileSettingsFormProps {
  role?: string; // 'student' | 'teacher' | 'admin'
}

export function ProfileSettingsForm({ role: roleProp }: ProfileSettingsFormProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userRole, setUserRole] = useState<string>(roleProp || "student");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    student_id: "",
    class_code: "",
    bio: "",
    date_of_birth: "",
    gender: "",
  });

  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

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
            full_name: data.full_name || "",
            student_id: data.student_id || "",
            class_code: data.class_code || "",
            bio: data.bio || "",
            date_of_birth: data.date_of_birth || "",
            gender: data.gender || "",
          });
          setAvatarUrl(data.avatar_url || null);
          if (!roleProp) setUserRole(data.role || "student");
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
    load();
  }, [roleProp]);

  const handleSave = async () => {
    setSaving(true);
    setProfileError("");
    try {
      const token = await getToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setProfileError(data.message || "Lỗi khi lưu");
      } else {
        const supabase = createClient();
        await supabase.auth.updateUser({ data: { full_name: form.full_name } });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        router.refresh();
      }
    } catch {
      setProfileError("Không thể kết nối máy chủ");
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setProfileError("Ảnh tối đa 2MB"); return; }

    setUploading(true);
    setProfileError("");
    try {
      const token = await getToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_URL}/api/profile/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setAvatarUrl(data.avatar_url);
        const supabase = createClient();
        await supabase.auth.updateUser({ data: { avatar_url: data.avatar_url } });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        router.refresh();
      } else {
        const data = await res.json();
        setProfileError(data.message || "Lỗi upload ảnh");
      }
    } catch {
      setProfileError("Upload thất bại");
    }
    setUploading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (pwForm.newPw.length < 6) { setPwError("Mật khẩu mới phải có ít nhất 6 ký tự"); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError("Mật khẩu xác nhận không khớp"); return; }

    setPwLoading(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.updateUser({ password: pwForm.newPw });
      if (error) { setPwError(error.message); }
      else {
        setPwSuccess("Đổi mật khẩu thành công!");
        setPwForm({ current: "", newPw: "", confirm: "" });
        setTimeout(() => setPwSuccess(""), 5000);
      }
    } catch {
      setPwError("Lỗi không xác định");
    }
    setPwLoading(false);
  };

  const initials = form.full_name
    ? form.full_name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const effectiveRole = roleProp || userRole;
  const showStudentFields = effectiveRole === "student" || !effectiveRole;

  const TABS = [
    { id: "profile" as const, label: "Hồ sơ", icon: User },
    { id: "security" as const, label: "Bảo mật", icon: Lock },
  ];

  return (
    <div>
      {/* Tab nav */}
      <div className="flex gap-1 mb-6 border-b border-indigo-900/30 pb-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? "text-indigo-400 border-indigo-500"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="bg-navy-950/60 shadow-sm rounded-2xl border border-white/10 overflow-hidden">
          {/* Avatar */}
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
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="mt-2 text-xs text-indigo-400 hover:text-amber-400 transition-colors font-medium">
                {uploading ? "Đang tải..." : "Thay đổi ảnh"}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            {profileError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{profileError}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Họ và tên", key: "full_name", placeholder: "Nguyễn Văn A" },
                ...(showStudentFields
                  ? [
                      { label: "Mã sinh viên", key: "student_id", placeholder: "2305HTTA001" },
                      { label: "Mã lớp", key: "class_code", placeholder: "2305HTTA" },
                    ]
                  : []),
                { label: "Ngày sinh", key: "date_of_birth", placeholder: "", type: "date" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                  <input
                    type={type ?? "text"}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-navy-950 border border-slate-700 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giới tính</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="" className="bg-navy-950">Chưa chọn</option>
                  <option value="male" className="bg-navy-950">Nam</option>
                  <option value="female" className="bg-navy-950">Nữ</option>
                  <option value="other" className="bg-navy-950">Khác</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giới thiệu</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Viết vài dòng về bản thân..."
                className="w-full bg-navy-950 border border-slate-700 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} disabled={saving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  saved ? "bg-green-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"
                } disabled:opacity-50`}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? "Đã lưu!" : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="bg-navy-950/60 shadow-sm rounded-2xl border border-white/10 p-6">
          <div className="mb-6">
            <h3 className="text-white font-bold mb-1">Đổi mật khẩu</h3>
            <p className="text-slate-400 text-sm">Cập nhật mật khẩu định kỳ để bảo vệ tài khoản</p>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-5">
            {pwError && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{pwError}</div>}
            {pwSuccess && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {pwSuccess}
              </div>
            )}



            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mật khẩu mới</label>
              <div className="relative">
                <input type={showNewPw ? "text" : "password"} value={pwForm.newPw}
                  onChange={(e) => setPwForm((f) => ({ ...f, newPw: e.target.value }))} required minLength={6} placeholder="Tối thiểu 6 ký tự"
                  className="w-full bg-navy-950 border border-slate-700 rounded-lg py-2.5 px-4 pr-10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwForm.newPw && (
                <div className="flex gap-1 mt-1.5">
                  {[1, 2, 3, 4].map((level) => {
                    const strength = pwForm.newPw.length >= 12 ? 4 : pwForm.newPw.length >= 8 ? 3 : pwForm.newPw.length >= 6 ? 2 : 1;
                    return (
                      <div key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= strength
                            ? strength <= 1 ? "bg-red-500" : strength <= 2 ? "bg-yellow-500" : strength <= 3 ? "bg-blue-500" : "bg-green-500"
                            : "bg-slate-700"
                        }`} />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Xác nhận mật khẩu mới</label>
              <input type="password" value={pwForm.confirm}
                onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))} required placeholder="Nhập lại mật khẩu mới"
                className="w-full bg-navy-950 border border-slate-700 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
              {pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
                <p className="text-xs text-red-400 mt-1">Mật khẩu không khớp</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={pwLoading || !pwForm.newPw || !pwForm.confirm}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                {pwLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                Cập nhật mật khẩu
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
