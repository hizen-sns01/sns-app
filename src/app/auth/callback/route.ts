import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      console.log('Exchanging code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth&details=${error.message}`)
      }

      console.log('Session created successfully:', !!data.session)
      
      // Verify session immediately
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Verified session exists:', !!session)

      if (!session) {
        return NextResponse.redirect(`${requestUrl.origin}/login?error=no_session`)
      }

      const response = NextResponse.redirect(`${requestUrl.origin}/chat`)
      
      // Set cookie with session info
      response.cookies.set('sb-auth-token', session.access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })

      return response
    } catch (error) {
      console.error('Unexpected error during auth:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=unexpected`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
}