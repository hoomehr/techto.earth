"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

type RegisterButtonProps = {
  eventId: string
}

export default function RegisterButton({ eventId }: RegisterButtonProps) {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [registering, setRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkRegistration = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data } = await supabase
          .from("event_registrations")
          .select("*")
          .eq("user_id", user.id)
          .eq("event_id", eventId)
          .single()

        setIsRegistered(!!data)
      } catch (error) {
        console.error("Error checking registration:", error)
      } finally {
        setLoading(false)
      }
    }

    checkRegistration()
  }, [user, eventId, supabase])

  const handleRegister = async () => {
    if (!user) {
      router.push("/auth")
      return
    }

    setRegistering(true)

    try {
      const { error } = await supabase.from("event_registrations").insert({
        user_id: user.id,
        event_id: eventId,
      })

      if (!error) {
        setIsRegistered(true)
        router.refresh()
      }
    } catch (error) {
      console.error("Error registering for event:", error)
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (isRegistered) {
    return (
      <Button className="w-full bg-green-700 hover:bg-green-800" onClick={() => router.push("/dashboard/events")}>
        You're Registered
      </Button>
    )
  }

  return (
    <Button className="w-full bg-yellow-500 hover:bg-yellow-600" onClick={handleRegister} disabled={registering}>
      {registering ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Registering...
        </>
      ) : (
        "Register Now"
      )}
    </Button>
  )
}
