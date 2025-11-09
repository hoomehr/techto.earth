import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react"
import RegisterButton from "@/components/events/register-button"
import Link from "next/link"
import { formatDate, formatTime } from "@/lib/utils"
import { getImageUrl } from "@/lib/image-utils"

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Fetch event details
  const { data: event } = await supabase.from("events").select("*").eq("id", params.id).single()

  if (!event || !event.is_published) {
    notFound()
  }

  // Format category for display
  const categoryMap: Record<string, string> = {
    "farm-tour": "Farm Tour",
    workshop: "Workshop",
    networking: "Networking",
    "job-fair": "Job Fair",
  }

  return (
    <div className="container py-8">
      <Link href="/events" className="flex items-center text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video w-full mb-6 rounded-lg overflow-hidden shadow-[0_5px_15px_rgba(234,179,8,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
            <Image
              src={getImageUrl(event.image_url, event.category) || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              <Calendar className="h-4 w-4" />
              {categoryMap[event.category] || event.category}
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-4">About This Event</h2>
            <p className="text-gray-700 mb-4">{event.description}</p>
          </div>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold mb-4">{event.price > 0 ? <>${event.price}</> : <>Free</>}</div>

              <RegisterButton eventId={event.id} />

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 py-2 border-b">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-600">{formatDate(event.start_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-b">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-gray-600">
                      {formatTime(event.start_date)} - {formatTime(event.end_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-b">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-b">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-gray-600">{event.capacity} attendees</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
