import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import CourseCard from "@/components/courses/course-card"

export default async function CoursesPage() {
  const supabase = createClient()

  // Fetch published courses
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  // Group courses by category
  const categories = [
    {
      id: "farming",
      name: "Farming & Agriculture",
      description: "Sustainable farming, permaculture, and crop management",
    },
    {
      id: "restaurant",
      name: "Restaurant & Food Service",
      description: "Restaurant management, farm-to-table, culinary skills",
    },
    { id: "crafts", name: "Craftsmanship & Trades", description: "Woodworking, metalworking, and traditional crafts" },
    { id: "business", name: "Business & Entrepreneurship", description: "Starting and running earth-based businesses" },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              <span className="text-green-600">Courses</span> for Your Transition
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Learn the skills you need to successfully transition from tech to agriculture, restaurants, and other
              hands-on careers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Browse All Courses</Button>
              <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                Filter by Category
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses && courses.length > 0 ? (
              courses.slice(0, 3).map((course) => (
                <div key={course.id} className="transform transition-all duration-300 hover:translate-y-[-5px]">
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No courses available yet. Check back soon!</p>
              </div>
            )}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
              <Link href="#all-courses" className="flex items-center gap-2">
                View All Courses <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16 bg-green-50" id="all-courses">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Course Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const categoryCount = courses?.filter((course) => course.category === category.id).length || 0

              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2">
                      <BookOpen className={`h-6 w-6 ${index % 2 === 0 ? "text-green-600" : "text-yellow-600"}`} />
                    </div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{categoryCount} courses</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="w-full text-green-700 hover:bg-green-100 hover:text-green-800"
                      asChild
                    >
                      <Link href={`/courses?category=${category.id}`}>Browse Category</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Your Learning Path</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              We've designed learning paths to guide your transition from tech to earth-based careers.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-green-200 z-0"></div>
            <div className="relative z-10 space-y-12">
              {[
                {
                  title: "Discover Your Path",
                  description:
                    "Take our assessment to find the right earth-based career for your skills and interests.",
                  icon: (
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                      1
                    </div>
                  ),
                },
                {
                  title: "Build Foundation Skills",
                  description: "Start with our core courses that teach the fundamentals of your chosen field.",
                  icon: (
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                      2
                    </div>
                  ),
                },
                {
                  title: "Hands-On Experience",
                  description: "Apply your knowledge through practical projects and internship opportunities.",
                  icon: (
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                      3
                    </div>
                  ),
                },
                {
                  title: "Transition Support",
                  description: "Get guidance on making the career switch with our mentorship program.",
                  icon: (
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                      4
                    </div>
                  ),
                },
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0 mt-1">{step.icon}</div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Start Your Learning Path</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="max-w-2xl mx-auto text-lg text-green-50 mb-8">
            Join our community of tech professionals transitioning to fulfilling earth-based careers.
          </p>
          <Button size="lg" className="bg-white text-green-700 hover:bg-green-50" asChild>
            <Link href="/auth">Enroll Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
