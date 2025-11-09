import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users, BookOpen, Star, ArrowLeft } from "lucide-react"
import EnrollButton from "@/components/courses/enroll-button"
import Link from "next/link"
import { getImageUrl } from "@/lib/image-utils"
import { sampleCourses } from "@/lib/sample-data"

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Fetch course details
  let { data: course } = await supabase.from("courses").select("*").eq("id", params.id).single()

  // Use sample data if no course found
  if (!course) {
    course = sampleCourses.find((c) => c.id === params.id)
  }

  if (!course || !course.is_published) {
    notFound()
  }

  // Format category for display
  const categoryMap: Record<string, string> = {
    farming: "Farming & Agriculture",
    restaurant: "Restaurant & Food Service",
    crafts: "Craftsmanship & Trades",
    business: "Business & Entrepreneurship",
  }

  // Format level for display
  const levelMap: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/career-path/courses" className="flex items-center text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video w-full mb-6 rounded-lg overflow-hidden shadow-[0_5px_15px_rgba(22,163,74,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
            <Image
              src={getImageUrl(course.image_url, course.category) || "/placeholder.svg"}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-1 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <BookOpen className="h-4 w-4" />
              {categoryMap[course.category] || course.category}
            </div>
            <div className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              <Star className="h-4 w-4" />
              4.8 (120 reviews)
            </div>
            <div className="flex items-center gap-1 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <Users className="h-4 w-4" />
              {Math.floor(Math.random() * 1000) + 100} students
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-4">About This Course</h2>
            <p className="text-gray-700 mb-4">{course.description}</p>

            {course.content && (
              <>
                <h2 className="text-xl font-semibold mb-4">Course Content</h2>
                <div className="whitespace-pre-wrap text-gray-700">{course.content}</div>
              </>
            )}
          </div>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold mb-4">{course.price > 0 ? <>${course.price}</> : <>Free</>}</div>

              <EnrollButton courseId={course.id} />

              <div className="mt-6 space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Level</span>
                  <span>{levelMap[course.level] || course.level}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Duration</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Category</span>
                  <span>{categoryMap[course.category] || course.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
