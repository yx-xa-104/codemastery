"use client";

import Link from "next/link";
import { User as UserType } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, GraduationCap, LayoutDashboard, LogOut, LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { signOut } from "@/features/auth/actions";

interface NavLink {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface MobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  pathname: string;
  navLinks: NavLink[];
  user: UserType | null;
  role: string | null;
}

export function MobileMenu({ open, setOpen, pathname, navLinks, user, role }: MobileMenuProps) {
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-nav overflow-hidden border-t border-border"
        >
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? "bg-indigo-500/15 text-indigo-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-3 border-t border-border flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    {avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-bold">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{displayName}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  {role === 'admin' && (
                    <Link href="/admin/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white">
                      <Shield className="w-5 h-5 text-red-400" /> Admin Panel
                    </Link>
                  )}
                  {role === 'teacher' && (
                    <Link href="/teacher/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white">
                      <GraduationCap className="w-5 h-5 text-amber-400" /> Teacher Panel
                    </Link>
                  )}
                  {(!role || role === 'student') && (
                    <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white">
                      <LayoutDashboard className="w-5 h-5 opacity-90 text-indigo-400" /> Dashboard
                    </Link>
                  )}
                  <form action={signOut}>
                    <Button type="submit" variant="ghost" className="w-full flex justify-start items-center gap-3 px-4 py-3 h-12 rounded-lg text-sm text-red-400 hover:bg-red-500/10">
                      <LogOut className="w-5 h-5" /> Đăng xuất
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setOpen(false)} className="w-full text-center py-3 text-slate-400 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-colors text-sm">
                    Đăng nhập
                  </Link>
                  <Link href="/auth/register" onClick={() => setOpen(false)} className="w-full text-center py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-glow-indigo transition-colors text-sm">
                    Bắt đầu ngay
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
