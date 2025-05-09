"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"

type EventCardProps = {
  event: any
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [registering, setRegistering] = useState(false)

  const handleRegister = async () => {
    if (!user) {
      router.push("/auth")
      return
    }

    setRegistering(true)

    try {
      const { error } = await supabase.from("event_registrations").insert({
        user_id: user.id,
        event_id: event.id,
      })

      if (!error) {
        router.push(`/events/${event.id}`)
        router.refresh()
      }
    } catch (error) {
      console.error("Error registering for event:", error)
    } finally {
      setRegistering(false)
    }
  }

  // Format category for display
  const categoryMap: Record<string, string> = {
    "farm-tour": "Farm Tour",
    workshop: "Workshop",
    networking: "Networking",
    "job-fair": "Job Fair",
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={event.image_url || "/placeholder.svg?height=200&width=400"}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-600" />
            {formatDate(event.start_date)}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-600" />
            {formatTime(event.start_date)} - {formatTime(event.end_date)}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600" />
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            {Math.floor(Math.random() * 100) + 10} attending
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
          onClick={handleRegister}
          disabled={registering}
        >
          {registering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
