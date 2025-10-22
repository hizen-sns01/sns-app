import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    await supabase.auth.exchangeCodeForSession(code)

    // Set the auth cookie
    const cookieStore = await cookies()
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      cookieStore.set('sb-access-token', session.access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      cookieStore.set('sb-refresh-token', session.refresh_token!, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
    }
  }

  return NextResponse.redirect(requestUrl.origin)
}