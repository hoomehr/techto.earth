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

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/courses/${course.id}`)
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
  
  // Truncate description
  const truncateDescription = (text: string, maxLength = 80) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <Link href={`/courses/${course.id}`} className="block hover:no-underline">
      <Card className="overflow-hidden transition-all duration-300 h-full group shadow-lg hover:shadow-xl hover:shadow-green-200/40 hover:translate-y-[-5px]">
        <div className="relative h-52 w-full overflow-hidden">
          {/* Permanent gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          
          {/* Hover overlay with button */}
          <div className="absolute inset-0 bg-black/60 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
              onClick={handleViewDetails}
              disabled={enrolling}
            >
              {enrolling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Course Details"
              )}
            </Button>
          </div>
          
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
          
          {/* Price badge overlaid on image */}
          <div className="absolute bottom-2 right-2 z-20">
            {course.price > 0 ? (
              <div className="text-sm font-medium bg-white/90 text-green-800 px-2 py-1 rounded shadow-sm">
                ${course.price}
              </div>
            ) : (
              <div className="text-sm font-medium bg-green-500 text-white px-2 py-1 rounded shadow-sm">
                Free
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{course.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 h-10 mb-3">
            {truncateDescription(course.description)}
          </p>
          
          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-green-600" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              4.8
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-green-600" />
              {Math.floor(Math.random() * 1000) + 100}
            </div>
            
            <div className="ml-auto flex gap-2">
              <div className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                {categoryMap[course.category] || course.category}
              </div>
              <div className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                {levelMap[course.level] || course.level}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
