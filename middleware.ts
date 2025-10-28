import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create a response to modify
  const res = NextResponse.next()

  try {
    // Create Supabase client
    const supabase = createMiddlewareClient({ req: request, res })

    // Refresh session
    const {
      data: { session },
      error
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Middleware session error:', error)
    }

    // Protected routes
    if (request.nextUrl.pathname.startsWith('/chat')) {
      if (!session) {
        console.log('No session found, redirecting to login')
        return NextResponse.redirect(new URL('/login', request.url))
      }
      console.log('Session found for /chat, proceeding')
    }

    // Auth routes
    if (request.nextUrl.pathname.startsWith('/login')) {
      if (session) {
        console.log('Session found, redirecting to chat')
        return NextResponse.redirect(new URL('/chat', request.url))
      }
      console.log('No session found for /login, proceeding')
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, proceed with the request but redirect protected routes to login
    if (request.nextUrl.pathname.startsWith('/chat')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}