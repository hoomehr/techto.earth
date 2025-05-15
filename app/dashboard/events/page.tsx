import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, ChevronRight, Clock, Plus } from "lucide-react"
import { formatDate } from "@/lib/utils"

type EventType = {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  image_url: string;
  category: string;
}

type EventRegistrationType = {
  id: string;
  user_id: string;
  event_id: string;
  status: string;
  registered_at: string;
  event: EventType;
}

export default async function DashboardEventsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's registered events with proper join
  const { data: rawRegisteredEvents, error: registrationError } = await supabase
    .from("event_registrations")
    .select(`
      id, 
      user_id, 
      event_id, 
      status, 
      registered_at,
      event:events(*)
    `)
    .eq("user_id", user?.id)
    .order("registered_at", { ascending: false })

  console.log("Raw events data:", JSON.stringify(rawRegisteredEvents?.slice(0, 1), null, 2))

  // Process data to handle the event property correctly
  const registeredEvents = rawRegisteredEvents?.map(registration => {
    let event = null;
    
    // Handle different ways Supabase might return the joined data
    if (Array.isArray(registration.event)) {
      // If it's an array (common with joins), take the first item
      event = registration.event.length > 0 ? registration.event[0] : null;
    } else if (typeof registration.event === 'object' && registration.event !== null) {
      // If it's already an object, use it directly
      event = registration.event;
    }
    
    return {
      ...registration,
      event
    };
  }) || [];

  console.log("Processed events:", registeredEvents.slice(0, 1).map(r => ({id: r.id, eventId: r.event_id, event: r.event ? {id: r.event.id, title: r.event.title} : null})))

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

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Your Events</h2>
        <Button className="bg-yellow-500 hover:bg-yellow-600" asChild>
          <Link href="/dashboard/events/create">
            <Plus className="mr-2 h-4 w-4" /> Create New Event
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="registered" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="registered">Registered Events</TabsTrigger>
          <TabsTrigger value="discover">Upcoming Events</TabsTrigger>
        </TabsList>

        <TabsContent value="registered">
          {registrationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
              <p>Error loading events: {registrationError.message}</p>
            </div>
          )}

          {registeredEvents && registeredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredEvents.map((registration) => {
                const event = registration.event;
                
                if (!event) {
                  console.log(`Event not found for registration ${registration.id}, event_id: ${registration.event_id}`);
                  return null;
                }
                
                const isPastEvent = new Date(event.end_date) < new Date()
                
                return (
                  <Card key={registration.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-yellow-200/30">
                    <div className="h-24 bg-gradient-to-r from-yellow-500 to-yellow-700 relative flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{event.title || 'Untitled Event'}</CardTitle>
                      <CardDescription>{event.description?.substring(0, 100) || 'No description available'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{formatDate(event.start_date)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{event.location || 'Location not specified'}</span>
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
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
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
                  <Card key={event.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-yellow-200/30">
                    <div className="h-24 bg-gradient-to-r from-yellow-500 to-yellow-700 relative flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{event.title || 'Untitled Event'}</CardTitle>
                      <CardDescription>{event.description?.substring(0, 100) || 'No description available'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{formatDate(event.start_date)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{event.location || 'Location not specified'}</span>
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
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
              <p className="text-gray-500">No upcoming events at the moment.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 