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
      course:courses(*)
    `)
    .eq("user_id", user?.id)
    .order("enrolled_at", { ascending: false })

  console.log("Raw enrolled courses:", JSON.stringify(rawEnrolledCourses?.slice(0, 1), null, 2))

  // Process data to handle the course property correctly
  const enrolledCourses = rawEnrolledCourses?.map(enrollment => {
    let course = null;
    
    // Handle different ways Supabase might return the joined data
    if (Array.isArray(enrollment.course)) {
      // If it's an array (common with joins), take the first item
      course = enrollment.course.length > 0 ? enrollment.course[0] : null;
    } else if (typeof enrollment.course === 'object' && enrollment.course !== null) {
      // If it's already an object, use it directly
      course = enrollment.course;
    }
    
    return {
      ...enrollment,
      course
    };
  }) || [];

  console.log("Processed courses:", enrolledCourses.slice(0, 1).map(e => ({id: e.id, courseId: e.course_id, course: e.course ? {id: e.course.id, title: e.course.title} : null})))

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

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Your Learning</h2>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/dashboard/courses/create">Create New Course</Link>
        </Button>
      </div>

      <Tabs defaultValue="enrolled" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="discover">Discover Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled">
          {enrollmentError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
              <p>Error loading courses: {enrollmentError.message}</p>
            </div>
          )}

          {enrolledCourses && enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((enrollment) => {
                const course = enrollment.course;
                
                if (!course) {
                  console.log(`Course not found for enrollment ${enrollment.id}, course_id: ${enrollment.course_id}`);
                  return null;
                }
                
                return (
                  <Card key={enrollment.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-green-200/40">
                    <div className="h-48 bg-gradient-to-r from-green-500 to-green-700 relative flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{course.title || 'Untitled Course'}</CardTitle>
                      <CardDescription>{course.description?.substring(0, 100) || 'No description available'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-500">{course.duration || 'N/A'}</span>
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
                      <CardTitle>{course.title || 'Untitled Course'}</CardTitle>
                      <CardDescription>{course.description?.substring(0, 100) || 'No description available'}</CardDescription>
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