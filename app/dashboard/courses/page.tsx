import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, ChevronRight } from "lucide-react"

export default async function DashboardCoursesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's enrolled courses
  const { data: enrollments } = await supabase
    .from("course_enrollments")
    .select("*, courses(*)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  // Fetch public courses for discovery
  const { data: publicCourses } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      <Tabs defaultValue="enrolled" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="discover">Discover Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled">
          {enrollments && enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => {
                const course = enrollment.courses
                if (!course) return null
                
                return (
                  <Card key={enrollment.id} className="overflow-hidden">
                    <div className="h-48 bg-gradient-to-r from-green-500 to-green-700 relative flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.short_description || course.description?.substring(0, 100)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-500">{course.duration}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {enrollment.completion_percentage || 0}% Complete
                        </Badge>
                      </div>
                      <Button variant="ghost" className="w-full mt-4 justify-between" asChild>
                        <Link href={`/courses/${course.id}`}>
                          Continue Learning <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover">
          {publicCourses && publicCourses.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-green-700 relative flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.short_description || course.description?.substring(0, 100)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/courses/${course.id}`}>
                          View Course
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link href="/courses">View All Courses</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No courses available at the moment.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 