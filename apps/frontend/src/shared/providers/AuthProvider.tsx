'use client';

import { useEffect, type ReactNode } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { useAuthStore } from '@/shared/stores/useAuthStore';

/**
 * AuthProvider: Initializes auth state from Supabase and syncs to Zustand store.
 * Wrap the app root with this component.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser]);

  return <>{children}</>;
}
