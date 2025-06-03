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
    origin: requestUrl.origin 
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
    console.log('👤 User metadata:', data.user.user_metadata)
    console.log('🔧 App metadata:', data.user.app_metadata)
    console.log('📧 Email confirmed:', !!data.user.email_confirmed_at)
    
    // Check provider type
    const provider = data.user.app_metadata?.provider || 'email'
    const isGoogleUser = provider === 'google'
    
    console.log('🔍 Provider detected:', provider)
    
    // For Google users, ensure profile exists and is synced
    if (isGoogleUser) {
      console.log('🌐 Processing Google OAuth user...')
      
      try {
        // Check if profile exists
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it manually
          console.log('🔄 Creating profile for Google user...')
          
          const profileData = {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.name || data.user.user_metadata?.full_name,
            display_name: data.user.user_metadata?.name || data.user.user_metadata?.given_name,
            avatar_url: data.user.user_metadata?.picture || data.user.user_metadata?.avatar_url,
            provider: 'google',
            signup_method: 'google',
            profile_completed: !!(data.user.user_metadata?.name), // Basic info present
          }
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(profileData)
          
          if (insertError) {
            console.error('❌ Error creating profile:', insertError)
          } else {
            console.log('✅ Profile created for Google user')
          }
        } else if (existingProfile) {
          console.log('✅ Profile exists for Google user:', existingProfile.full_name)
          
          // Update profile with latest Google data if needed
          const shouldUpdate = 
            !existingProfile.avatar_url && data.user.user_metadata?.picture ||
            !existingProfile.full_name && data.user.user_metadata?.name ||
            existingProfile.provider !== 'google'
          
          if (shouldUpdate) {
            console.log('🔄 Updating Google user profile with latest data...')
            
            const updateData = {
              avatar_url: data.user.user_metadata?.picture || existingProfile.avatar_url,
              full_name: data.user.user_metadata?.name || existingProfile.full_name,
              display_name: data.user.user_metadata?.name || existingProfile.display_name,
              provider: 'google',
            }
            
            const { error: updateError } = await supabase
              .from('profiles')
              .update(updateData)
              .eq('id', data.user.id)
            
            if (updateError) {
              console.error('❌ Error updating profile:', updateError)
            } else {
              console.log('✅ Profile updated with Google data')
            }
          }
        }
      } catch (profileSyncError) {
        console.error('⚠️ Error syncing Google profile:', profileSyncError)
        // Don't fail the auth flow for profile sync issues
      }
    }
    
    // Determine redirect destination based on user state
    let redirectPath = '/dashboard'
    
    // Check if user needs to complete profile
    const hasBasicInfo = data.user.user_metadata?.full_name || 
                        data.user.user_metadata?.name ||
                        data.user.user_metadata?.display_name
    
    const profileCompleted = data.user.user_metadata?.profile_completed
    
    console.log('🔍 Profile check:', {
      hasBasicInfo: !!hasBasicInfo,
      profileCompleted: !!profileCompleted,
      provider: provider,
      isGoogleUser: isGoogleUser
    })
    
    // Google users typically have basic info, but may need additional profile completion
    if (isGoogleUser) {
      // Google users have name/avatar from OAuth, but may need interests/background
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
    
    return NextResponse.redirect(new URL(redirectPath, request.url))
    
  } catch (error) {
    console.error('💥 Unexpected error in auth callback:', error)
    const errorMessage = error instanceof Error ? error.message : 'Authentication_error'
    const encodedError = encodeURIComponent(errorMessage)
    return NextResponse.redirect(new URL(`/auth?error=${encodedError}`, request.url))
  }
} 