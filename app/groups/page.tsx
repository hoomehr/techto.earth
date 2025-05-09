import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Globe, MapPin, MessageSquare, Users } from "lucide-react"

export default function GroupsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              <span className="text-green-600">Groups</span> & Communities
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Connect with like-minded tech professionals who are transitioning to earth-based careers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Find a Group</Button>
              <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                Start a Group
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Groups */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Featured Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Tech Farmers Alliance",
                description: "A community of former tech professionals who now run farms across the country.",
                image: "/placeholder.svg?height=200&width=400",
                members: 1245,
                location: "Nationwide",
                discussions: 87,
              },
              {
                title: "Code to Kitchen",
                description: "Tech professionals exploring careers in restaurants, catering, and food service.",
                image: "/placeholder.svg?height=200&width=400",
                members: 892,
                location: "Online + Local Chapters",
                discussions: 64,
              },
              {
                title: "Digital Nomads to Homesteaders",
                description: "Remote workers transitioning to self-sufficient homesteading lifestyles.",
                image: "/placeholder.svg?height=200&width=400",
                members: 1567,
                location: "Global",
                discussions: 112,
              },
            ].map((group, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image src={group.image || "/placeholder.svg"} alt={group.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{group.title}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      {group.members} members
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      {group.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      {group.discussions} active discussions
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Join Group</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
              <Link href="#" className="flex items-center gap-2">
                View All Groups <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Group Categories */}
      <section className="py-16 bg-green-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Group Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Farming & Agriculture",
                description: "Connect with tech professionals in farming",
                icon: <Globe className="h-6 w-6 text-green-600" />,
                groups: 24,
              },
              {
                title: "Food & Restaurants",
                description: "Communities focused on culinary careers",
                icon: <Globe className="h-6 w-6 text-yellow-600" />,
                groups: 18,
              },
              {
                title: "Crafts & Trades",
                description: "Groups for those pursuing artisanal work",
                icon: <Globe className="h-6 w-6 text-green-600" />,
                groups: 15,
              },
              {
                title: "Sustainability",
                description: "Communities focused on sustainable living",
                icon: <Globe className="h-6 w-6 text-yellow-600" />,
                groups: 22,
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
                  <p className="text-sm text-gray-600">{category.groups} active groups</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-green-700 hover:bg-green-100 hover:text-green-800">
                    Browse Groups
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Group Spotlight */}
      <section className="py-16">
        <div className="container">
          <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-full">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Group Spotlight"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 lg:p-12">
                <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded mb-4">
                  Group Spotlight
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Silicon Valley Farmers</h3>
                <p className="text-gray-600 mb-6">
                  One of our most active communities, Silicon Valley Farmers brings together former tech workers who now
                  run farms in California. They meet monthly, share resources, and have helped over 50 members
                  successfully transition to agricultural careers.
                </p>
                <div className="space-y-3 text-sm text-gray-600 mb-8">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    2,450 members
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    San Francisco Bay Area + Online
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    156 active discussions
                  </div>
                </div>
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  Join This Group
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start a Group */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Start Your Own Group</h2>
              <p className="text-lg text-green-50 mb-6">
                Can't find a group that matches your interests? Create your own community and connect with like-minded
                individuals.
              </p>
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50">
                Create a Group
              </Button>
            </div>
            <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Benefits of Starting a Group</h3>
              <ul className="space-y-3">
                {[
                  "Build a community around your specific interests",
                  "Get support from our platform with promotion and tools",
                  "Connect with others on the same journey",
                  "Share resources and knowledge",
                  "Create local meetups and events",
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

      {/* Testimonials */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What Our Members Say</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Hear from tech professionals who found their community through our groups.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white border-green-100">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      alt="Profile"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-gray-600 italic mb-4">
                      "Finding the Tech Farmers Alliance was a game-changer for me. The support and knowledge sharing
                      from other former tech workers made my transition to farming so much smoother."
                    </p>
                    <p className="font-medium">David R.</p>
                    <p className="text-sm text-gray-500">Former Software Developer, now Organic Farmer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-yellow-100">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      alt="Profile"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-gray-600 italic mb-4">
                      "The Code to Kitchen group provided me with both emotional support and practical advice as I
                      transitioned from a tech career to opening my own bakery. I've made lifelong friends."
                    </p>
                    <p className="font-medium">Jennifer T.</p>
                    <p className="text-sm text-gray-500">Former UX Designer, now Bakery Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
