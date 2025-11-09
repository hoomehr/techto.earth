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
import Link from "next/link"
import { getImageUrl } from "@/lib/image-utils"

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
        router.push(`/career-path/events/${event.id}`)
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
    <Link href={`/career-path/events/${event.id}`} className="block hover:no-underline">
      <Card className="overflow-hidden transition-all duration-300 h-full group hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:translate-y-[-5px]">
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
          <Image
            src={getImageUrl(event.image_url, event.category) || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
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
            onClick={(e) => {
              e.preventDefault()
              handleRegister()
            }}
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
    </Link>
  )
}
