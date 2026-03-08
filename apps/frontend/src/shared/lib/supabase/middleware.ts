import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: any[]) {
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }: any) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Routes shared by all authenticated users
  const sharedPaths = ['/account', '/auth/callback'];
  const isShared = sharedPaths.some((p) => pathname.startsWith(p));

  // Auth pages (login, register, forgot, reset)
  const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  // Protected routes — redirect to login if not authenticated
  const protectedPaths = ['/dashboard', '/account', '/admin', '/teacher', '/courses', '/lessons', '/roadmap'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // For authenticated users, apply role-based routing
  if (user && !isShared) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'student';

    // Redirect logged-in users away from auth pages
    if (isAuthPage) {
      const url = request.nextUrl.clone();
      if (role === 'admin') url.pathname = '/admin/dashboard';
      else if (role === 'teacher') url.pathname = '/teacher/dashboard';
      else url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Admin: can only access /admin/* and /account/*
    if (role === 'admin' && !pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }

    // Teacher: can only access /teacher/* and /account/*
    if (role === 'teacher' && !pathname.startsWith('/teacher')) {
      const url = request.nextUrl.clone();
      url.pathname = '/teacher/dashboard';
      return NextResponse.redirect(url);
    }

    // Student: cannot access /admin/* or /teacher/*
    if (role === 'student' || !role) {
      if (pathname.startsWith('/admin') || pathname.startsWith('/teacher')) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
