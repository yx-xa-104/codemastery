"use client";

import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

export type UserRole = 'student' | 'teacher' | 'admin';

interface AuthState {
    user: User | null;
    role: UserRole;
    loading: boolean;
    setUser: (user: User | null) => void;
    setRole: (role: UserRole) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    role: 'student',
    loading: true,
    setUser: (user) => set({ user, loading: false }),
    setRole: (role) => set({ role }),
    setLoading: (loading) => set({ loading }),
}));

// Convenience hook
export function useUser() {
    const user = useAuthStore((s) => s.user);
    const role = useAuthStore((s) => s.role);
    const loading = useAuthStore((s) => s.loading);
    return { user, role, loading };
}
