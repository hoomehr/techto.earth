import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  
  console.log('🔗 Auth callback triggered:', { 
    hasCode: !!code, 
    error: error,
    origin: requestUrl.origin,
    url: requestUrl.toString()
  })
  
  // Handle OAuth errors
  if (error) {
    console.error('❌ OAuth error:', error, error_description)
    const errorMessage = error_description || error
    const encodedError = encodeURIComponent(errorMessage)
    return NextResponse.redirect(new URL(`/auth?error=${encodedError}`, request.url))
  }
  
  if (!code) {
    console.log('⚠️ No auth code found, redirecting to auth page')
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    
    console.log('🔄 Exchanging auth code for session...')
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('❌ Session exchange error:', exchangeError)
      const encodedError = encodeURIComponent(exchangeError.message)
      return NextResponse.redirect(new URL(`/auth?error=${encodedError}`, request.url))
    }
    
    if (!data.session || !data.user) {
      console.error('❌ No session or user returned after code exchange')
      return NextResponse.redirect(new URL('/auth?error=Authentication_failed', request.url))
    }
    
    console.log('✅ Session exchange successful for user:', data.user.id)
    console.log('👤 User email:', data.user.email)
    console.log('🔧 App metadata:', JSON.stringify(data.user.app_metadata, null, 2))
    console.log('👤 User metadata:', JSON.stringify(data.user.user_metadata, null, 2))
    
    // Enhanced provider detection
    const providers = data.user.app_metadata?.providers || []
    const primaryProvider = data.user.app_metadata?.provider
    const hasGoogleMetadata = !!(
      data.user.user_metadata?.picture ||
      data.user.user_metadata?.provider_id ||
      data.user.user_metadata?.sub ||
      data.user.user_metadata?.name
    )
    
    const isGoogleUser = 
      providers.includes('google') || 
      primaryProvider === 'google' ||
      hasGoogleMetadata
    
    const provider = isGoogleUser ? 'google' : (primaryProvider || 'email')
    
    console.log('🔍 Provider analysis:', {
      primaryProvider,
      providers,
      hasGoogleMetadata,
      finalProvider: provider,
      isGoogleUser
    })
    
    // Check if profile exists - this will tell us if the trigger worked
    console.log('🔍 Checking if profile exists...')
    let profileExists = false
    try {
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, full_name, provider, profile_completed')
        .eq('id', data.user.id)
        .single()
      
      if (profileCheckError) {
        if (profileCheckError.code === 'PGRST116') {
          console.log('📝 No profile exists yet - trigger should create one')
          profileExists = false
        } else {
          console.error('❌ Error checking profile:', profileCheckError)
          // Don't fail auth flow for profile check issues
          profileExists = false
        }
      } else {
        console.log('✅ Profile exists:', {
          id: existingProfile.id,
          name: existingProfile.full_name,
          provider: existingProfile.provider,
          completed: existingProfile.profile_completed
        })
        profileExists = true
      }
    } catch (profileError) {
      console.warn('⚠️ Profile check failed:', profileError)
      profileExists = false
    }
    
    // If no profile exists, try to create one manually (fallback)
    if (!profileExists) {
      console.log('🔧 Manually creating profile as fallback...')
      try {
        const profileData = {
          id: data.user.id,
          full_name: isGoogleUser 
            ? (data.user.user_metadata?.name || data.user.user_metadata?.full_name)
            : (data.user.user_metadata?.full_name || data.user.user_metadata?.name),
          display_name: isGoogleUser
            ? (data.user.user_metadata?.name || data.user.user_metadata?.given_name)
            : (data.user.user_metadata?.display_name || data.user.user_metadata?.full_name),
          avatar_url: isGoogleUser
            ? data.user.user_metadata?.picture
            : data.user.user_metadata?.avatar_url,
          provider: provider,
          signup_method: isGoogleUser ? 'google' : 'email',
          profile_completed: isGoogleUser && data.user.user_metadata?.name ? true : false
        }
        
        console.log('💾 Creating profile with data:', JSON.stringify(profileData, null, 2))
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData)
        
        if (insertError) {
          console.error('❌ Manual profile creation failed:', insertError)
          // Don't fail auth flow for profile creation issues
        } else {
          console.log('✅ Manual profile creation successful')
          profileExists = true
        }
      } catch (manualCreateError) {
        console.error('❌ Manual profile creation error:', manualCreateError)
        // Don't fail auth flow
      }
    }
    
    // Determine redirect destination
    let redirectPath = '/dashboard'
    
    // Check profile completion status
    const hasBasicInfo = data.user.user_metadata?.full_name || 
                        data.user.user_metadata?.name ||
                        data.user.user_metadata?.display_name
    
    const profileCompleted = data.user.user_metadata?.profile_completed
    
    console.log('🔍 Profile completion check:', {
      hasBasicInfo: !!hasBasicInfo,
      profileCompleted: !!profileCompleted,
      provider: provider,
      isGoogleUser: isGoogleUser
    })
    
    // Redirect logic
    if (isGoogleUser) {
      // Google users have basic info but may need additional profile completion
      if (!profileCompleted) {
        redirectPath = '/dashboard/profile/complete'
        console.log('🚀 Redirecting Google user to profile completion (interests/background)')
      } else {
        redirectPath = '/dashboard'
        console.log('🚀 Redirecting Google user to dashboard (profile complete)')
      }
    } else {
      // Email or other users
      if (!profileCompleted || !hasBasicInfo) {
        redirectPath = '/dashboard/profile/complete'
        console.log('🚀 Redirecting to profile completion (missing info)')
      } else {
        redirectPath = '/dashboard'
        console.log('🚀 Redirecting to dashboard (profile complete)')
      }
    }
    
    console.log(`✅ Auth flow complete, redirecting to: ${redirectPath}`)
    return NextResponse.redirect(new URL(redirectPath, request.url))
    
  } catch (error) {
    console.error('💥 Unexpected error in auth callback:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    const errorMessage = error instanceof Error ? error.message : 'Authentication_error'
    const encodedError = encodeURIComponent(errorMessage)
    return NextResponse.redirect(new URL(`/auth?error=${encodedError}`, request.url))
  }
} 