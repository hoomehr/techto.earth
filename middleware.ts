import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  try {
    // Debug cookies being set
    console.log('Middleware processing, cookies present:', request.cookies.size > 0)
    
    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = request.cookies.get(name)
            // Debug cookie retrieval
            console.log(`Getting cookie ${name}:`, cookie ? 'exists' : 'missing')
            return cookie?.value
          },
          set(name: string, value: string, options: any) {
            // Debug cookie setting
            console.log(`Setting cookie ${name}`)
            // Only try to set if value is valid
            if (value) {
              try {
                request.cookies.set({ name, value, ...options })
                response.cookies.set({ name, value, ...options })
              } catch (err) {
                console.error(`Error setting cookie ${name}:`, err)
              }
            }
          },
          remove(name: string, options: any) {
            // Debug cookie removal
            console.log(`Removing cookie ${name}`)
            request.cookies.delete({ name, ...options })
            response.cookies.delete({ name, ...options })
          },
        },
      }
    )
    
    // Refresh session if expired - required for Server Components
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Session retrieval error:', error)
    }
  } catch (err) {
    console.error('Middleware error:', err)
  }
  
  return response
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 