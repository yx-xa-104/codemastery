"use client";

import Link from "next/link";
import { User as UserType } from "@supabase/supabase-js";
import { ChevronDown, Shield, GraduationCap, LayoutDashboard, Settings, User as UserIcon, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { signOut } from "@/features/auth/actions";

interface UserDropdownProps {
  user: UserType;
  role: string | null;
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;
  userMenuRef: React.RefObject<HTMLDivElement | null>;
}

export function UserDropdown({ user, role, userMenuOpen, setUserMenuOpen, userMenuRef }: UserDropdownProps) {
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={userMenuRef}>
      <Button
        variant="ghost"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="flex items-center gap-2 px-2 py-1.5 h-11 rounded-lg hover:bg-white/5 transition-colors group"
      >
        {avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full border-2 border-indigo-500/50" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-bold border-2 border-indigo-500/50">
            {initials}
          </div>
        )}
        <span className="text-sm font-medium text-slate-300 max-w-[120px] truncate hidden md:block">
          {displayName}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {userMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-xl bg-gray-900 border border-slate-800 shadow-2xl overflow-hidden z-50"
          >
            <div className="p-3 border-b border-slate-800">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <div className="p-1">
              {role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Shield className="w-4 h-4 text-red-400" />
                  Admin Panel
                </Link>
              )}
              {role === 'teacher' && (
                <Link
                  href="/teacher/dashboard"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  Teacher Panel
                </Link>
              )}
              {(!role || role === 'student') && (
                <Link
                  href="/dashboard"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  Dashboard
                </Link>
              )}
              <Link
                href="/dashboard/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Cài đặt
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                Hồ sơ
              </Link>
            </div>
            <div className="p-1 border-t border-slate-800">
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full flex justify-start items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
