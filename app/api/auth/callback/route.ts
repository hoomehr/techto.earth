import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('Auth callback triggered, code exists:', !!code)
  
  if (code) {
    try {
      const res = NextResponse.redirect(new URL('/dashboard', request.url))
      const supabase = createMiddlewareClient({ req: request, res })
      
      console.log('Exchanging code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Session exchange error:', error)
        return NextResponse.redirect(new URL('/auth?error=' + encodeURIComponent(error.message), request.url))
      }
      
      console.log('Session exchange successful, redirecting to dashboard')
      return res
    } catch (error) {
      console.error('Unexpected error in callback:', error)
      return NextResponse.redirect(new URL('/auth?error=Unexpected_auth_error', request.url))
    }
  }

  // Redirect to the home page if no code
  console.log('No code found, redirecting to home')
  return NextResponse.redirect(new URL('/', request.url))
} 