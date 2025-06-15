import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgotPassword',
  '/resetPassword',
  '/api/auth'
]

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/chat',
  '/explorer',
  '/diagrams',
  '/settings',
  '/profile',
  '/timeline'
]

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    const { pathname } = request.nextUrl

    // Allow public routes and static assets
    if (
      publicRoutes.some(route => pathname.startsWith(route)) ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/auth')
    ) {
      // Redirect authenticated users trying to access auth pages to dashboard
      if (token && publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return NextResponse.next()
    }

    // Protect routes that require authentication
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      if (!token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
      return NextResponse.next()
    }

    // Default behavior for unmatched routes
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware Error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
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