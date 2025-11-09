"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Star, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { getImageUrl } from "@/lib/image-utils"

type CourseCardProps = {
  course: any
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [enrolling, setEnrolling] = useState(false)

  const handleEnroll = async () => {
    if (!user) {
      router.push("/auth")
      return
    }

    setEnrolling(true)

    try {
      const { error } = await supabase.from("course_enrollments").insert({
        user_id: user.id,
        course_id: course.id,
      })

      if (!error) {
        router.push(`/courses/${course.id}`)
        router.refresh()
      }
    } catch (error) {
      console.error("Error enrolling in course:", error)
    } finally {
      setEnrolling(false)
    }
  }

  // Format category for display
  const categoryMap: Record<string, string> = {
    farming: "Farming",
    restaurant: "Restaurant",
    crafts: "Crafts",
    business: "Business",
  }

  // Format level for display
  const levelMap: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }

  return (
    <Link href={`/courses/${course.id}`} className="block hover:no-underline">
      <Card className="overflow-hidden transition-all duration-300 h-full group hover:shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:translate-y-[-5px]">
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
          <Image
            src={
              course.category === "farming"
                ? "https://www.poultryworld.net/app/uploads/2021/04/001_756_IMG_eggfarm1.jpg"
                : getImageUrl(course.image_url, course.category) || "/placeholder.svg?height=400&width=600"
            }
            alt={course.title || "Course image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.onerror = null // Prevent infinite loop
              target.src = "/placeholder.svg?height=400&width=600"
            }}
          />
        </div>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-green-600" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              4.8 (120 reviews)
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-green-600" />
              {Math.floor(Math.random() * 1000) + 100} students
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
              {levelMap[course.level] || course.level}
            </div>
            {course.price > 0 ? (
              <div className="text-sm font-medium">${course.price}</div>
            ) : (
              <div className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded">Free</div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={(e) => {
              e.preventDefault()
              handleEnroll()
            }}
            disabled={enrolling}
          >
            {enrolling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enrolling...
              </>
            ) : (
              "Enroll Now"
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
