import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookies().set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookies().delete({ name, ...options })
          },
        },
      }
    )
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to the home page
  return NextResponse.redirect(new URL('/', request.url))
} 