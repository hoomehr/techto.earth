import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, Clock, MapPin, Users } from "lucide-react"

export default function EventsPage() {
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
            {[
              {
                title: "Farm Tour & Networking",
                description:
                  "Visit an organic farm run by former tech professionals and network with like-minded individuals.",
                image: "/placeholder.svg?height=200&width=400",
                date: "May 15, 2025",
                time: "10:00 AM - 2:00 PM",
                location: "Green Valley Farm, Portland",
                attendees: 28,
              },
              {
                title: "Restaurant Management Workshop",
                description: "Learn the essentials of running a farm-to-table restaurant from successful owners.",
                image: "/placeholder.svg?height=200&width=400",
                date: "May 22, 2025",
                time: "6:00 PM - 9:00 PM",
                location: "Harvest Kitchen, Seattle",
                attendees: 42,
              },
              {
                title: "Permaculture Design Weekend",
                description: "Intensive hands-on workshop on permaculture principles and design techniques.",
                image: "/placeholder.svg?height=200&width=400",
                date: "June 5-6, 2025",
                time: "9:00 AM - 5:00 PM",
                location: "Sustainable Living Center, Austin",
                attendees: 35,
              },
            ].map((event, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      {event.attendees} attending
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Register Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-50">
              <Link href="#" className="flex items-center gap-2">
                View All Events <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-16 bg-yellow-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Event Types</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Farm Tours",
                description: "Visit farms run by former tech professionals",
                icon: <MapPin className="h-6 w-6 text-green-600" />,
                count: 12,
              },
              {
                title: "Workshops",
                description: "Hands-on learning experiences in various fields",
                icon: <Users className="h-6 w-6 text-yellow-600" />,
                count: 24,
              },
              {
                title: "Networking",
                description: "Connect with others on the same journey",
                icon: <Users className="h-6 w-6 text-green-600" />,
                count: 8,
              },
              {
                title: "Job Fairs",
                description: "Meet potential employers in earth-based industries",
                icon: <Calendar className="h-6 w-6 text-yellow-600" />,
                count: 6,
              },
            ].map((category, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2">
                    {category.icon}
                  </div>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{category.count} upcoming events</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800">
                    Browse Events
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="py-16">
        <div className="container">
          <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-full">
                <Image src="/placeholder.svg?height=400&width=600" alt="Featured Event" fill className="object-cover" />
              </div>
              <div className="p-8 lg:p-12">
                <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded mb-4">
                  Featured Event
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Annual Tech-to-Earth Conference</h3>
                <p className="text-gray-600 mb-6">
                  Join us for our flagship event bringing together hundreds of tech professionals who have successfully
                  transitioned to earth-based careers. Featuring keynote speakers, panel discussions, workshops, and
                  networking opportunities.
                </p>
                <div className="space-y-3 text-sm text-gray-600 mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    July 15-17, 2025
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    Green Conference Center, San Francisco
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    350+ attendees expected
                  </div>
                </div>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  Register Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <Button size="lg" className="bg-white text-yellow-600 hover:bg-yellow-50">
                Apply to Host
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
