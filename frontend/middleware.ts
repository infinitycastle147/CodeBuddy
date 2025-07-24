import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgotPassword',
  '/resetPassword'
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
    const { pathname } = request.nextUrl

    // Allow NextAuth API routes
    if (pathname.startsWith('/api/auth')) {
      const response = NextResponse.next()
      addSecurityHeaders(response)
      return response
    }

    // Allow static assets and Next.js internals
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.includes('.')
    ) {
      const response = NextResponse.next()
      addSecurityHeaders(response)
      return response
    }

    const token = await getToken({ 
      req: request,
      secret: process.env.AUTH_SECRET 
    })

    // Check if current path is a public route
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    )

    // Check if current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )

    // Redirect authenticated users from auth pages to dashboard
    if (token && isPublicRoute && pathname !== '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect unauthenticated users from protected routes to login
    if (!token && isProtectedRoute) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware Error:', error)
    // Don't redirect on error, just continue
    return NextResponse.next()
  }
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
}