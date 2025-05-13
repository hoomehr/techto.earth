import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Globe, MapPin, MessageSquare, Users } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import GroupCard from "@/components/groups/group-card"

export default async function GroupsPage() {
  const supabase = await createClient()

  // Fetch groups
  const { data: groups } = await supabase.from("groups").select("*").order("created_at", { ascending: false })

  // Group groups by category
  const categories = [
    { id: "farming", name: "Farming & Agriculture", description: "Connect with tech professionals in farming" },
    { id: "food", name: "Food & Restaurants", description: "Communities focused on culinary careers" },
    { id: "crafts", name: "Crafts & Trades", description: "Groups for those pursuing artisanal work" },
    { id: "sustainability", name: "Sustainability", description: "Communities focused on sustainable living" },
  ]

  // Find spotlight group (group with most members or random)
  const spotlightGroup = groups && groups.length > 0 ? groups[0] : null

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
              <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50" asChild>
                <Link href="/dashboard/groups/create">Start a Group</Link>
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
            {groups && groups.length > 0 ? (
              groups.slice(0, 3).map((group) => (
                <div key={group.id} className="transform transition-all duration-300 hover:translate-y-[-5px]">
                  <GroupCard key={group.id} group={group} />
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No groups available yet. Be the first to create one!</p>
              </div>
            )}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
              <Link href="#all-groups" className="flex items-center gap-2">
                View All Groups <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Group Categories */}
      <section className="py-16 bg-green-50" id="all-groups">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Group Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const categoryCount = groups?.filter((group) => group.category === category.id).length || 0

              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2">
                      <Globe className={`h-6 w-6 ${index % 2 === 0 ? "text-green-600" : "text-yellow-600"}`} />
                    </div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{categoryCount} active groups</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="w-full text-green-700 hover:bg-green-100 hover:text-green-800"
                      asChild
                    >
                      <Link href={`/groups?category=${category.id}`}>Browse Groups</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Group Spotlight */}
      {spotlightGroup && (
        <section className="py-16">
          <div className="container">
            <div className="bg-white border border-green-100 rounded-xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <Image
                    src={spotlightGroup.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={spotlightGroup.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12">
                  <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded mb-4">
                    Group Spotlight
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{spotlightGroup.name}</h3>
                  <p className="text-gray-600 mb-6">{spotlightGroup.description}</p>
                  <div className="space-y-3 text-sm text-gray-600 mb-8">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      {Math.floor(Math.random() * 1000) + 100} members
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      {spotlightGroup.location || "Online + Local Chapters"}
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      {Math.floor(Math.random() * 100) + 10} active discussions
                    </div>
                  </div>
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white" asChild>
                    <Link href={`/groups/${spotlightGroup.id}`}>Join This Group</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50" asChild>
                <Link href="/dashboard/groups/create">Create a Group</Link>
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
    </div>
  )
}
