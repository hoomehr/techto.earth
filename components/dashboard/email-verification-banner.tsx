"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { AlertCircle, Loader2 } from "lucide-react"

export default function EmailVerificationBanner({ userEmail }: { userEmail: string }) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleResendEmail = async () => {
    setLoading(true)
    setError(null)
    setSent(false)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSent(true)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Alert className="mb-6 bg-yellow-50 border-yellow-200">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800 font-medium">Email verification required</AlertTitle>
      <AlertDescription className="text-yellow-700">
        <p className="mb-2">
          You haven't verified your email address yet. Please verify your email to ensure account security and access to all features.
        </p>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {sent && <p className="text-green-600 mb-2">Verification email sent! Please check your inbox.</p>}
        <Button 
          onClick={handleResendEmail} 
          variant="outline" 
          size="sm"
          className="border-yellow-500 text-yellow-600 hover:bg-yellow-100"
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Resend verification email
        </Button>
      </AlertDescription>
    </Alert>
  )
} 