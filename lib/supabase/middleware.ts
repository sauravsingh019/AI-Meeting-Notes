import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminEmail } from '@/config/site';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-project-id.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { user: realUser } } = await supabase.auth.getUser();
  const demoMode = request.cookies.get('demo_mode')?.value;

  let user: any = realUser;
  if (!user && demoMode) {
    user = {
      id: demoMode === 'admin' ? 'demo-admin-id' : 'demo-user-id',
      email: demoMode === 'admin' ? 'demo-admin@aimeetings.com' : 'demo-user@aimeetings.com',
    };
  }
  const path = request.nextUrl.pathname;

  // Protect routes if user is NOT logged in
  if (!user) {
    if (path.startsWith('/dashboard') || path.startsWith('/profile')) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Handle routing if user IS logged in
  if (user) {
    const isAdmin = isAdminEmail(user.email);

    // Redirect logged-in users away from login page
    if (path === '/login') {
      const url = request.nextUrl.clone();
      url.pathname = isAdmin ? '/dashboard' : '/profile';
      return NextResponse.redirect(url);
    }

    // Restrict /dashboard only to Admin emails
    if (path.startsWith('/dashboard') && !isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/profile';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
