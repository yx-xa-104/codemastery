'use client';

import { useEffect, type ReactNode } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { useAuthStore, type UserRole } from '@/shared/stores/useAuthStore';

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setRole = useAuthStore((s) => s.setRole);

  const fetchRole = async (userId: string) => {
    const supabase = createClient();
    const { data } = await (supabase as any)
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    if (data?.role) {
      setRole(data.role as UserRole);
    }
  };

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchRole(user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user ?? null;
        setUser(user);
        if (user) {
          fetchRole(user.id);
        } else {
          setRole('student');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setRole]);

  return <>{children}</>;
}
