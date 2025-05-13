import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Filter, Search } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import CourseCard from "@/components/courses/course-card"

// Define props type for the page
type CoursesPageProps = {
  searchParams?: {
    category?: string;
    level?: string;
    price?: string;
    search?: string;
  };
};

export default async function CoursesPage({ searchParams = {} }: CoursesPageProps) {
  const supabase = await createClient()
  
  // Get filters from search params
  const categoryFilter = searchParams.category || ''
  const levelFilter = searchParams.level || ''
  const priceFilter = searchParams.price || ''
  const searchQuery = searchParams.search || ''

  // Fetch published courses
  let query = supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    
  // Apply category filter if present
  if (categoryFilter) {
    query = query.eq("category", categoryFilter)
  }
  
  // Apply level filter if present
  if (levelFilter) {
    query = query.eq("level", levelFilter)
  }
  
  // Apply price filter if present
  if (priceFilter === 'free') {
    query = query.eq("price", 0)
  } else if (priceFilter === 'paid') {
    query = query.gt("price", 0)
  }
  
  // Apply search if present
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`)
  }
  
  const { data: allCourses } = await query
    .order("created_at", { ascending: false })
    .limit(20) // Increased limit to ensure we get all courses

  const courses = allCourses || []
  
  // Initially visible courses (first 9)
  const initialCourses = courses.slice(0, 9)
  const hasMoreCourses = courses.length > 9

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
  
  // Level options
  const levels = [
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" },
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
              <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <a href="#all-courses">Browse All Courses</a>
              </Button>
              <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                Filter by Category
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="container">
          <form action="/courses" method="get" className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Search courses..."
                defaultValue={searchQuery}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Category Filter */}
              <div className="relative inline-block">
                <select 
                  name="category"
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  defaultValue={categoryFilter}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              {/* Level Filter */}
              <div className="relative inline-block">
                <select 
                  name="level"
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  defaultValue={levelFilter}
                >
                  <option value="">All Levels</option>
                  {levels.map((level) => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              {/* Price Filter */}
              <div className="relative inline-block">
                <select 
                  name="price"
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  defaultValue={priceFilter}
                >
                  <option value="">Any Price</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              {/* Apply Filters Button */}
              <Button type="submit" className="text-sm bg-green-600 hover:bg-green-700 text-white">
                Apply Filters
              </Button>
              
              {/* Clear Filters */}
              <Link href="/courses" passHref>
                <Button type="button" variant="outline" className="text-sm border-gray-300 text-gray-600 hover:bg-gray-50">
                  Clear Filters
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* All Courses Section */}
      <section className="py-16" id="all-courses">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            {categoryFilter 
              ? `${categories.find(c => c.id === categoryFilter)?.name || 'Category'} Courses` 
              : 'All Courses'
            }
            {searchQuery && <span className="text-lg font-normal ml-2">matching "{searchQuery}"</span>}
          </h2>
          {initialCourses && initialCourses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {initialCourses.map((course) => (
                  <div key={course.id} className="transform transition-all duration-300">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMoreCourses && (
                <div className="mt-12 text-center">
                  <Link href={`/courses/all${categoryFilter ? `?category=${categoryFilter}` : ''}`} passHref>
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                      Load All Courses <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Showing {initialCourses.length} of {courses.length} courses
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No courses available for these filters. Try different criteria!</p>
            </div>
          )}
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16 bg-green-50">
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
