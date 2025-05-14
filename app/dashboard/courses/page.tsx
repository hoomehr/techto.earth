import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, ChevronRight } from "lucide-react"

// Define types for our data
type CourseType = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  materials_url?: string;
  duration: string;
  level: string;
  category: string;
  price: number;
  is_published: boolean;
}

type CourseEnrollmentType = {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  progress: number;
  enrolled_at: string;
  course: CourseType;
}

export default async function DashboardCoursesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's enrolled courses with join to get course details
  const { data: rawEnrolledCourses, error: enrollmentError } = await supabase
    .from("course_enrollments")
    .select(`
      id, 
      user_id, 
      course_id, 
      status, 
      progress, 
      enrolled_at,
      course:courses(
        id, 
        title, 
        description,
        image_url, 
        duration, 
        level,
        category,
        price,
        is_published
      )
    `)
    .eq("user_id", user?.id)
    .order("enrolled_at", { ascending: false })

  console.log("Enrolled courses query result:", { enrolledCourses: rawEnrolledCourses, enrollmentError })

  // Process data to handle the course property correctly
  const enrolledCourses = rawEnrolledCourses?.map(enrollment => {
    // Supabase returns the joined courses as an array, but we need it as an object
    // We know there is only one course per enrollment, so we take the first item
    const courseArray = enrollment.course as unknown as CourseType[];
    const course = courseArray && courseArray.length > 0 ? courseArray[0] : null;
    
    return {
      ...enrollment,
      course
    } as CourseEnrollmentType;
  }) || [];

  // Fetch public courses for discovery
  const { data: publicCoursesRaw } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6)
    
  const publicCourses = publicCoursesRaw as CourseType[] || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      <Tabs defaultValue="enrolled" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="discover">Discover Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled">
          {enrolledCourses && enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((enrollment) => {
                const course = enrollment.course
                if (!course) return null
                
                return (
                  <Card key={enrollment.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-green-200/40">
                    <div className="h-48 bg-gradient-to-r from-green-500 to-green-700 relative flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description?.substring(0, 100)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-500">{course.duration}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {enrollment.progress || 0}% Complete
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
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
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
                  <Card key={course.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-green-200/40">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-green-700 relative flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description?.substring(0, 100)}</CardDescription>
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
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
              <p className="text-gray-500">No courses available at the moment.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 