import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import EventCard from "@/components/events/event-card"
import { formatDate } from "@/lib/utils"

export default async function EventsPage() {
  const supabase = await createClient()

  // Fetch published events
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })

  // Group events by category
  const categories = [
    {
      id: "farm-tour",
      name: "Farm Tours",
      description: "Visit farms run by former tech professionals",
      icon: <MapPin className="h-6 w-6 text-green-600" />,
    },
    {
      id: "workshop",
      name: "Workshops",
      description: "Hands-on learning experiences in various fields",
      icon: <Users className="h-6 w-6 text-yellow-600" />,
    },
    {
      id: "networking",
      name: "Networking",
      description: "Connect with others on the same journey",
      icon: <Users className="h-6 w-6 text-green-600" />,
    },
    {
      id: "job-fair",
      name: "Job Fairs",
      description: "Meet potential employers in earth-based industries",
      icon: <Calendar className="h-6 w-6 text-yellow-600" />,
    },
  ]

  // Find featured event (closest upcoming event)
  const featuredEvent = events && events.length > 0 ? events[0] : null

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              <span className="text-yellow-600">Events</span> & Workshops
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Connect with farms, restaurants, and other earth-based businesses through our events and workshops.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Browse All Events</Button>
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                Filter by Location
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events && events.length > 0 ? (
              events.slice(0, 3).map((event) => (
                <div key={event.id} className="transform transition-all duration-300 hover:translate-y-[-5px]">
                  <EventCard key={event.id} event={event} />
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No events available yet. Check back soon!</p>
              </div>
            )}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-50">
              <Link href="#all-events" className="flex items-center gap-2">
                View All Events <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-16 bg-yellow-50" id="all-events">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Event Types</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const categoryCount = events?.filter((event) => event.category === category.id).length || 0

              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2">
                      {category.icon}
                    </div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{categoryCount} upcoming events</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="w-full text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800"
                      asChild
                    >
                      <Link href={`/events?category=${category.id}`}>Browse Events</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <section className="py-16">
          <div className="container">
            <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <Image
                    src={featuredEvent.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12">
                  <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded mb-4">
                    Featured Event
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{featuredEvent.title}</h3>
                  <p className="text-gray-600 mb-6">{featuredEvent.description}</p>
                  <div className="space-y-3 text-sm text-gray-600 mb-8">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      {formatDate(featuredEvent.start_date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      {featuredEvent.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      {Math.floor(Math.random() * 100) + 10} attending
                    </div>
                  </div>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                    <Link href={`/events/${featuredEvent.id}`}>Register Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Host an Event */}
      <section className="py-16 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Host Your Own Event</h2>
              <p className="text-lg text-yellow-50 mb-6">
                Are you a former tech professional who has successfully transitioned? Share your experience by hosting
                an event or workshop on our platform.
              </p>
              <Button size="lg" className="bg-white text-yellow-600 hover:bg-yellow-50" asChild>
                <Link href="/dashboard/events/create">Apply to Host</Link>
              </Button>
            </div>
            <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Benefits of Hosting</h3>
              <ul className="space-y-3">
                {[
                  "Connect with like-minded individuals",
                  "Share your knowledge and experience",
                  "Build your personal brand in your new field",
                  "Receive support and resources from our team",
                  "Earn additional income through workshop fees",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1 h-4 w-4 rounded-full bg-white flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
