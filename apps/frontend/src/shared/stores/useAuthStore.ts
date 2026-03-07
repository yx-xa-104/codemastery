"use client";

import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

interface AuthState {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user, loading: false }),
    setLoading: (loading) => set({ loading }),
}));

// Convenience hook (same API as old useUser)
export function useUser() {
    const user = useAuthStore((s) => s.user);
    const loading = useAuthStore((s) => s.loading);
    return { user, loading };
}
