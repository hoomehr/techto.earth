"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("signin")
  const router = useRouter()
  const supabase = createClient()

  const clearMessages = () => {
    setError(null)
    setMessage(null)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    clearMessages()

    console.log('🔄 Starting signup process...')
    console.log('📧 Email:', email)
    console.log('👤 Full name:', fullName)

    try {
      // Validate inputs
      if (!email || !password || !fullName) {
        setError("Please fill in all required fields")
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long")
        setLoading(false)
        return
      }

      // Create user with metadata as per Supabase documentation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            display_name: fullName,
            signup_method: 'email',
            profile_completed: false
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      console.log('📊 Signup response:', { 
        user: data.user ? 'Created' : 'None', 
        session: data.session ? 'Active' : 'None',
        error: error?.message 
      })

      if (error) {
        console.error('❌ Signup error:', error)
        
        // Handle specific Supabase error cases
        if (error.message.includes('User already registered')) {
          setError("An account with this email already exists. Please sign in instead.")
          setActiveTab("signin")
        } else if (error.message.includes('Invalid email')) {
          setError("Please enter a valid email address")
        } else if (error.message.includes('Password')) {
          setError("Password must be at least 6 characters long")
        } else {
          setError(error.message)
        }
        return
      }

      if (data.user) {
        console.log('✅ User created successfully:', data.user.id)
        
        // According to Supabase docs: if email confirmation is enabled, session will be null
        if (!data.session) {
          console.log('📧 Email confirmation required')
          setMessage(
            `A confirmation email has been sent to ${email}. ` +
            "Please check your email and click the confirmation link to complete your registration."
          )
          
          // Clear form
          setEmail("")
          setPassword("")
          setFullName("")
          return
        }

        console.log('🚀 User logged in immediately, redirecting to profile completion...')
        // If session exists (email confirmation disabled), redirect immediately
        router.push("/dashboard/profile/complete")
        router.refresh()
      }
    } catch (error: any) {
      console.error('💥 Unexpected signup error:', error)
      setError(error?.message || "An unexpected error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    clearMessages()

    console.log('🔄 Starting signin process...')

    try {
      // Validate inputs
      if (!email || !password) {
        setError("Please fill in all required fields")
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 Signin response:', { 
        user: data.user ? 'Found' : 'None', 
        session: data.session ? 'Active' : 'None',
        error: error?.message 
      })

      if (error) {
        console.error('❌ Signin error:', error)
        
        // Handle specific Supabase error cases
        if (error.message.includes('Invalid login credentials')) {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else if (error.message.includes('Email not confirmed')) {
          setError("Please confirm your email address before signing in. Check your inbox for a confirmation link.")
        } else if (error.message.includes('Too many requests')) {
          setError("Too many sign-in attempts. Please wait a moment and try again.")
        } else {
          setError(error.message)
        }
        return
      }

      if (data.user && data.session) {
        console.log('✅ User signed in successfully:', data.user.id)
        
        // Check if user needs to complete profile based on user metadata
        const needsProfileCompletion = !data.user.user_metadata?.profile_completed
        
        console.log('🔍 Profile completion needed:', needsProfileCompletion)
        console.log('👤 User metadata:', data.user.user_metadata)
        
        if (needsProfileCompletion) {
          router.push("/dashboard/profile/complete")
        } else {
          router.push("/dashboard")
        }
        router.refresh()
      }
    } catch (error: any) {
      console.error('💥 Unexpected signin error:', error)
      setError(error?.message || "An unexpected error occurred during sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    clearMessages()
    console.log('🔄 Starting Google OAuth process')

    try {
      const origin = window.location.origin
      const redirectUrl = `${origin}/api/auth/callback`
      console.log('🔗 Using redirect URL:', redirectUrl)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('❌ Google OAuth error:', error)
        setError(`Google sign-in failed: ${error.message}`)
        setGoogleLoading(false)
        return
      }

      console.log('✅ Google OAuth initiated, redirecting...')
      // Don't set loading to false here as we're redirecting
    } catch (error: any) {
      console.error('💥 Unexpected error during Google sign in:', error)
      setError(error?.message || "An unexpected error occurred with Google sign in")
      setGoogleLoading(false)
    }
  }

  // Check for auth errors in URL (from redirects)
  useEffect(() => {
    try {
      const url = new URL(window.location.href)
      const errorParam = url.searchParams.get('error')
      const errorDescription = url.searchParams.get('error_description')
      
      if (errorParam) {
        const decodedError = errorDescription ? 
          `${errorParam}: ${decodeURIComponent(errorDescription)}` : 
          errorParam
        console.log('🔗 URL error detected:', decodedError)
        setError(decodedError)
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    } catch (e) {
      console.warn('⚠️ Error parsing URL params:', e)
    }
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="button" 
            variant="outline" 
            className="w-full mb-4 flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative mb-4">
            <Separator />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
              OR
            </span>
          </div>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                  autoComplete="current-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={loading || googleLoading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-fullName">Full Name *</Label>
                <Input
                  id="signup-fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email *</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password *</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading || googleLoading}
                  autoComplete="new-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-yellow-600" 
                disabled={loading || googleLoading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
