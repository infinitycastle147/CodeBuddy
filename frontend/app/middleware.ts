import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    // Check if the user is authenticated
    const token = await getToken({ req: request });
    const url = request.nextUrl.clone();

    // If the user is authenticated, allow access to the dashboard
    if (token && (
        url.pathname.startsWith('/forgotPassword')
        || url.pathname.startsWith('/resetPassword')
        || url.pathname.startsWith('/login')
        || url.pathname.startsWith('/register')
        || url.pathname === '/'
    )){
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

  return NextResponse.redirect(new URL('/login', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/forgotPassword',
        '/resetPassword',
        '/login',
        '/register',
        '/',
        '/dashboard/:path*',
  ],
}