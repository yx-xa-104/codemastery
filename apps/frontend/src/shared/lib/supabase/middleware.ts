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

  // Protected routes — redirect to login if not authenticated
  const protectedPaths = ['/dashboard', '/account', '/admin', '/teacher'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Role-based access control for /admin and /teacher
  if (user && (pathname.startsWith('/admin') || pathname.startsWith('/teacher'))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'student';

    // /admin/* — only admin can access
    if (pathname.startsWith('/admin') && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // /teacher/* — only teacher can access
    if (pathname.startsWith('/teacher') && role !== 'teacher') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // /dashboard — redirect to role-specific panel
    if (pathname === '/dashboard') {
      if (role === 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
      }
      if (role === 'teacher') {
        const url = request.nextUrl.clone();
        url.pathname = '/teacher/dashboard';
        return NextResponse.redirect(url);
      }
    }
  }

  // Redirect logged-in users away from auth pages
  const authPaths = ['/auth/login', '/auth/register'];
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (isAuthPage && user) {
    // Redirect to role-specific dashboard
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    const role = (profile as any)?.role || 'student';
    const url = request.nextUrl.clone();
    if (role === 'admin') url.pathname = '/admin/dashboard';
    else if (role === 'teacher') url.pathname = '/teacher/dashboard';
    else url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
