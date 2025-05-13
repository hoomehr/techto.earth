import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Filter, Search } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import CourseCard from "@/components/courses/course-card"

// Define props type for the page
type AllCoursesPageProps = {
  searchParams?: {
    category?: string;
    level?: string;
    price?: string;
    search?: string;
  };
};

export default async function AllCoursesPage({ searchParams = {} }: AllCoursesPageProps) {
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
  
  const { data: courses } = await query
    .order("created_at", { ascending: false })
    .limit(50) // Higher limit for "all" view
  
  // Group courses by category for filter
  const categories = [
    {
      id: "farming",
      name: "Farming & Agriculture",
    },
    {
      id: "restaurant",
      name: "Restaurant & Food Service",
    },
    { id: "crafts", name: "Craftsmanship & Trades" },
    { id: "business", name: "Business & Entrepreneurship" },
  ]
  
  // Level options
  const levels = [
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Filter Bar */}
      <section className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="container">
          <div className="flex items-center mb-4">
            <Link href="/courses" passHref>
              <Button variant="ghost" className="gap-1 text-green-700 hover:text-green-800 hover:bg-green-50 -ml-2">
                <ArrowLeft className="h-4 w-4" /> Back to Courses
              </Button>
            </Link>
          </div>
          
          <form action="/courses/all" method="get" className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
              <Link href="/courses/all" passHref>
                <Button type="button" variant="outline" className="text-sm border-gray-300 text-gray-600 hover:bg-gray-50">
                  Clear Filters
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* All Courses Section */}
      <section className="py-12 flex-grow">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            {categoryFilter 
              ? `All ${categories.find(c => c.id === categoryFilter)?.name || 'Category'} Courses` 
              : 'All Courses'
            }
            {searchQuery && <span className="text-lg font-normal ml-2">matching "{searchQuery}"</span>}
          </h1>
          
          {courses && courses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="transform transition-all duration-300">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Showing all {courses.length} courses
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
    </div>
  )
} 