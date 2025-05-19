import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          try {
            // In Next.js 14+, cookies() is synchronous 
            const cookieStore = cookies()
            const cookie = cookieStore.get(name)
            return cookie?.value
          } catch (error) {
            console.error(`Error retrieving cookie ${name}:`, error)
            return undefined
          }
        },
        async set(name: string, value: string, options: any) {
          try {
            // Ensure value is valid before setting
            if (typeof value === 'string') {
              const cookieStore = cookies()
              cookieStore.set({ name, value, ...options })
            } else {
              console.warn(`Invalid cookie value for ${name}, not setting cookie`)
            }
          } catch (error) {
            console.error(`Error setting cookie ${name}:`, error)
          }
        },
        async remove(name: string, options: any) {
          try {
            const cookieStore = cookies()
            cookieStore.delete({ name, ...options })
          } catch (error) {
            console.error(`Error removing cookie ${name}:`, error)
          }
        },
      },
    }
  )
}
