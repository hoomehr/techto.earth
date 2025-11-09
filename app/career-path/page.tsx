import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Calendar, Users, Code, Sprout } from "lucide-react"

export default function CareerPathHome() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-50 to-white py-20 md:py-28">
        <div className="container flex flex-col items-center text-center">
          <div className="flex items-center justify-center mb-6 space-x-2">
            <Code className="h-8 w-8 text-gray-600" />
            <ArrowRight className="h-6 w-6 text-yellow-500" />
            <Sprout className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4">
            From <span className="text-gray-700">Tech</span> to <span className="text-green-600">Earth</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-gray-600 mb-8">
            Helping tech professionals transition to farming, agriculture, restaurants, and other fulfilling manual
            careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              Start Your Journey
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Make The Switch?</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Discover the benefits of transitioning from a tech career to working with the earth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-green-100">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Meaningful Work</CardTitle>
                <CardDescription>Connect with nature and see the tangible results of your labor.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Trade screen time for green time. Experience the satisfaction of growing food and working with your
                  hands.
                </p>
              </CardContent>
            </Card>
            <Card className="border-yellow-100">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                  <Sprout className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Healthier Lifestyle</CardTitle>
                <CardDescription>Improve your physical and mental wellbeing through active work.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Escape the sedentary tech lifestyle. Enjoy more movement, fresh air, and connection to natural cycles.
                </p>
              </CardContent>
            </Card>
            <Card className="border-green-100">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Transferable Skills</CardTitle>
                <CardDescription>Your tech background is a valuable asset in modern agriculture.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Apply your problem-solving abilities and technical knowledge to innovate in sustainable farming
                  practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Sections Preview */}
      <section className="py-16 bg-green-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How We Help You Transition</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Explore our three pillars of support for your journey from tech to earth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-green-200 hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-700">Courses</CardTitle>
                <CardDescription>Learn essential skills for your new career</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  From permaculture design to restaurant management, our courses are tailored for tech professionals
                  making the switch.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 bg-transparent">
                  <Link href="/career-path/courses" className="flex items-center gap-2">
                    Explore Courses <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="bg-white border-yellow-200 hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-yellow-700">Events</CardTitle>
                <CardDescription>Connect with farms, restaurants, and opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Attend workshops, farm tours, and networking events to experience different career paths firsthand.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  variant="outline"
                  className="border-yellow-600 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                >
                  <Link href="/career-path/events" className="flex items-center gap-2">
                    Browse Events <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="bg-white border-green-200 hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-700">Groups</CardTitle>
                <CardDescription>Join a community of like-minded professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Connect with others who have made the transition or are on the same journey as you.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 bg-transparent">
                  <Link href="/career-path/groups" className="flex items-center gap-2">
                    Find Groups <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Hear from tech professionals who successfully made the transition.
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
                      "After 12 years as a software engineer, I now run a small organic farm. CareerPath's courses gave
                      me the confidence to make the leap."
                    </p>
                    <p className="font-medium">Michael K.</p>
                    <p className="text-sm text-gray-500">Former Software Engineer, now Organic Farmer</p>
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
                      "I was burning out as a product manager. Now I co-own a farm-to-table restaurant. The events
                      connected me with my business partner."
                    </p>
                    <p className="font-medium">Sarah L.</p>
                    <p className="text-sm text-gray-500">Former Product Manager, now Restaurant Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make the Transition?</h2>
          <p className="max-w-2xl mx-auto text-lg text-green-50 mb-8">
            Join thousands of tech professionals who have found fulfillment in working with the earth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50">
              Start Your Journey
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-yellow-400 text-yellow-50 hover:bg-green-500 hover:text-white bg-transparent"
            >
              Browse Success Stories
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
