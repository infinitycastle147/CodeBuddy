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

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Allow NextAuth API routes
    if (pathname.startsWith('/api/auth')) {
      return NextResponse.next()
    }

    // Allow static assets and Next.js internals
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    // Check if current path is a public route
    const isPublicRoute = publicRoutes.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    )

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    // Redirect authenticated users from auth pages to dashboard
    if (token && isPublicRoute && pathname !== '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect unauthenticated users from protected routes to login
    if (!token && !isPublicRoute) {
      const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname + request.nextUrl.search);
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }
  catch (error)
  {
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