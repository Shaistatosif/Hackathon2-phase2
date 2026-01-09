import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/chat', '/analytics'];

// Routes that should redirect authenticated users
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth token in cookies or local storage isn't directly accessible
  // in middleware, so we check for a custom header or use server-side session
  // For now, we'll handle auth redirection client-side with the useAuth hooks

  // Allow all requests to pass through
  // Auth protection is handled by useRequireAuth hook in components
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
