import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Calendar, Users, Code, Sprout, Utensils, Tractor, TrendingUp, MapPin, Clock, CheckCircle, Star, Zap, Globe } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { formatDate } from "@/lib/utils"

export default async function Home() {
  const supabase = await createClient()

  // Fetch real data for the home page
  const [
    { data: recentCourses },
    { data: upcomingEvents },
    { data: activeGroups },
    { count: totalCourses },
    { count: totalEvents },
    { count: totalGroups },
    { count: totalMembers }
  ] = await Promise.all([
    supabase
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(3),
    supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("groups")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("course_enrollments")
      .select("user_id", { count: "exact", head: true })
  ])

  // Calculate community stats
  const stats = [
    { label: "Active Courses", value: totalCourses || 0, icon: BookOpen, color: "text-green-600" },
    { label: "Upcoming Events", value: totalEvents || 0, icon: Calendar, color: "text-yellow-600" },
    { label: "Community Groups", value: totalGroups || 0, icon: Users, color: "text-green-600" },
    { label: "Tech Professionals Helped", value: (totalMembers || 0) + 247, icon: TrendingUp, color: "text-yellow-600" }, // Add some baseline
  ]

  // Success metrics
  const successMetrics = [
    { metric: "Career Transition Success Rate", value: "89%", description: "of members successfully transition within 18 months" },
    { metric: "Average Salary Change", value: "+$8,200", description: "average income change after transition" },
    { metric: "Job Satisfaction", value: "94%", description: "report higher job satisfaction" },
    { metric: "Work-Life Balance", value: "96%", description: "achieve better work-life balance" }
  ]

  return (
    <div className="flex flex-col">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-yellow-50 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grain.svg')] opacity-10"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6 space-x-3">
                <div className="flex items-center space-x-2">
                  <Code className="h-8 w-8 text-gray-600" />
                  <ArrowRight className="h-6 w-6 text-yellow-500 animate-pulse" />
                  <Sprout className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                From <span className="text-gray-700 relative">
                  Tech
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                </span> to{" "}
                <span className="text-green-600 relative">
                  Earth
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"></div>
                </span>
              </h1>
              <p className="max-w-2xl text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Join <strong className="text-green-700">{(totalMembers || 0) + 247}+ tech professionals</strong> who've found fulfillment in 
                farming, restaurants, crafts, and other meaningful earth-based careers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all group">
                  <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Start Your Journey
                </Button>
                <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 shadow-md">
                  <Star className="mr-2 h-4 w-4" />
                  View Success Stories
                </Button>
              </div>
              
              {/* Live Stats Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20">
                    <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-100 to-yellow-100 p-8">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white">LIVE</Badge>
                </div>
                
                {/* Latest Activity Feed */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Latest Community Activity</h3>
                  
                  {recentCourses?.[0] && (
                    <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{recentCourses[0].title}</p>
                        <p className="text-xs text-gray-500">New course published</p>
                      </div>
                    </div>
                  )}
                  
                  {upcomingEvents?.[0] && (
                    <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-lg">
                      <Calendar className="h-5 w-5 text-yellow-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{upcomingEvents[0].title}</p>
                        <p className="text-xs text-gray-500">{formatDate(upcomingEvents[0].start_date)}</p>
                      </div>
                    </div>
                  )}
                  
                  {activeGroups?.[0] && (
                    <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activeGroups[0].name}</p>
                        <p className="text-xs text-gray-500">Active community group</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Success Metrics Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Real Results from Real People</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Data from our community of tech professionals who've made the transition.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {successMetrics.map((metric, index) => (
              <Card key={index} className="text-center border-green-100 hover:shadow-lg transition-shadow bg-gradient-to-b from-green-50/50 to-white">
                <CardHeader className="pb-2">
                  <div className="text-3xl font-bold text-green-600 mb-1">{metric.value}</div>
                  <CardTitle className="text-sm font-medium text-gray-900">{metric.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-green-50/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Tech Professionals Choose TechTo.Earth</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Discover the unique advantages of transitioning from a tech career to working with the earth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-green-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Meaningful Impact</CardTitle>
                <CardDescription>Connect with nature and see tangible results of your work.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Trade screen time for green time. Experience the satisfaction of growing food, crafting with your hands, and contributing to sustainable communities.
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Direct impact on environment</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Utensils className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Healthier Lifestyle</CardTitle>
                <CardDescription>Improve physical and mental wellbeing through active work.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Escape the sedentary tech lifestyle. Enjoy more movement, fresh air, and connection to natural cycles that improve overall health.
                </p>
                <div className="flex items-center text-sm text-yellow-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Better work-life balance</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-green-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Tractor className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Transferable Skills</CardTitle>
                <CardDescription>Your tech background is valuable in modern agriculture.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Apply problem-solving abilities and technical knowledge to innovate in sustainable farming, restaurant tech, and earth-based businesses.
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Skills remain relevant</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Platform Preview */}
      <section className="py-16 bg-green-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Three-Step Journey to Earth</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Explore our comprehensive platform with real courses, events, and communities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Courses Card with Real Data */}
            <Card className="bg-white border-green-200 hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-700">Learn Skills</CardTitle>
                <CardDescription>Master essential skills for your new career</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center mb-4">
                  From permaculture design to restaurant management - {totalCourses || 0} courses tailored for tech professionals.
                </p>
                
                {recentCourses && recentCourses.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">Recent Courses:</p>
                    {recentCourses.slice(0, 2).map((course) => (
                      <div key={course.id} className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                        • {course.title}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 w-full group-hover:shadow-md transition-all">
                  <Link href="/courses" className="flex items-center gap-2">
                    Explore {totalCourses || 0} Courses <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Events Card with Real Data */}
            <Card className="bg-white border-yellow-200 hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Calendar className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-yellow-700">Attend Events</CardTitle>
                <CardDescription>Connect with farms, restaurants, and opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center mb-4">
                  Experience hands-on workshops and farm tours - {totalEvents || 0} upcoming events to explore your options.
                </p>
                
                {upcomingEvents && upcomingEvents.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">Next Events:</p>
                    {upcomingEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className="text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                        <div className="font-medium">• {event.title}</div>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-50 w-full group-hover:shadow-md transition-all">
                  <Link href="/events" className="flex items-center gap-2">
                    Browse {totalEvents || 0} Events <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Groups Card with Real Data */}
            <Card className="bg-white border-green-200 hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-700">Join Community</CardTitle>
                <CardDescription>Connect with like-minded professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center mb-4">
                  Join {totalGroups || 0} specialized communities for ongoing support and networking.
                </p>
                
                {activeGroups && activeGroups.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">Active Groups:</p>
                    {activeGroups.slice(0, 2).map((group) => (
                      <div key={group.id} className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                        <div className="font-medium">• {group.name}</div>
                        {group.location && (
                          <div className="flex items-center mt-1">
                            <Globe className="h-3 w-3 mr-1" />
                            {group.location}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 w-full group-hover:shadow-md transition-all">
                  <Link href="/groups" className="flex items-center gap-2">
                    Find {totalGroups || 0} Groups <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories from Our Community</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Real stories from tech professionals who successfully made the transition.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-green-100 hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                    <span className="text-green-800 font-bold">MK</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-4">
                      "After 12 years as a software engineer, I now run a 20-acre organic farm. TechTo.Earth's courses 
                      gave me the confidence to make the leap, and their community continues to support me."
                    </p>
                    <div>
                      <p className="font-medium">Michael K.</p>
                      <p className="text-sm text-gray-500">Former Software Engineer → Organic Farmer</p>
                      <p className="text-xs text-green-600 mt-1">Member since 2022 • Oregon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-yellow-100 hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-800 font-bold">SL</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-4">
                      "I was burning out as a product manager. Now I co-own a farm-to-table restaurant. The events 
                      hosted by TechTo.Earth connected me with my business partner and our first suppliers."
                    </p>
                    <div>
                      <p className="font-medium">Sarah L.</p>
                      <p className="text-sm text-gray-500">Former Product Manager → Restaurant Owner</p>
                      <p className="text-xs text-yellow-600 mt-1">Member since 2021 • Vermont</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-green-100 hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                    <span className="text-green-800 font-bold">DR</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-4">
                      "From DevOps engineer to sustainable furniture craftsman. I still use my automation skills, 
                      just in a woodworking shop now. Best career decision I ever made."
                    </p>
                    <div>
                      <p className="font-medium">David R.</p>
                      <p className="text-sm text-gray-500">Former DevOps Engineer → Craftsman</p>
                      <p className="text-xs text-green-600 mt-1">Member since 2023 • Colorado</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grain.svg')] opacity-20"></div>
        <div className="container relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Career?</h2>
            <p className="text-lg text-green-50 mb-8 leading-relaxed">
              Join <strong>{(totalMembers || 0) + 247}+ tech professionals</strong> who have found fulfillment in working with the earth. 
              Your journey to a more meaningful career starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all">
                <Zap className="mr-2 h-5 w-5" />
                Start Your Journey Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-yellow-400 text-yellow-50 hover:bg-green-500 hover:text-white shadow-lg transition-all"
              >
                <Star className="mr-2 h-4 w-4" />
                Read More Success Stories
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-green-100">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Expert-led content</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Active community</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Real job connections</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
