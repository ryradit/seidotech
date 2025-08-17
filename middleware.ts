import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // Handle admin routes
  if (isAdminRoute) {
    if (!session && !isLoginPage) {
      // Redirect to login if trying to access admin pages without session
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    if (session && isLoginPage) {
      // Redirect to admin dashboard if already logged in
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
