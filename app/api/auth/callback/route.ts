import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const res = NextResponse.redirect(new URL('/dashboard', request.url))
    const supabase = createMiddlewareClient({ req: request, res })
    await supabase.auth.exchangeCodeForSession(code)
    return res
  }

  // Redirect to the home page if no code
  return NextResponse.redirect(new URL('/', request.url))
} 