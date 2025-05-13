import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, ChevronRight, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function DashboardEventsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's registered events
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("*, events(*)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  // Fetch upcoming events for discovery
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(6)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Events</h1>

      <Tabs defaultValue="registered" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="registered">Registered Events</TabsTrigger>
          <TabsTrigger value="discover">Upcoming Events</TabsTrigger>
        </TabsList>

        <TabsContent value="registered">
          {registrations && registrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.map((registration) => {
                const event = registration.events
                if (!event) return null
                
                const isPastEvent = new Date(event.end_date) < new Date()
                
                return (
                  <Card key={registration.id} className="overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-yellow-500 to-yellow-700 relative flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{event.description?.substring(0, 100)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{formatDate(event.start_date)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{event.location}</span>
                        </div>
                      </div>
                      {isPastEvent ? (
                        <Badge className="bg-gray-100 text-gray-800">
                          Past Event
                        </Badge>
                      ) : (
                        <Button variant="ghost" className="w-full justify-between" asChild>
                          <Link href={`/events/${event.id}`}>
                            View Details <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
              <Button className="bg-yellow-500 hover:bg-yellow-600" asChild>
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover">
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-yellow-500 to-yellow-700 relative flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{event.description?.substring(0, 100)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{formatDate(event.start_date)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{event.location}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/events/${event.id}`}>
                          View Event
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link href="/events">View All Events</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No upcoming events at the moment.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 