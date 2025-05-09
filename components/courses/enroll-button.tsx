"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

type EnrollButtonProps = {
  courseId: string
}

export default function EnrollButton({ courseId }: EnrollButtonProps) {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data } = await supabase
          .from("course_enrollments")
          .select("*")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .single()

        setIsEnrolled(!!data)
      } catch (error) {
        console.error("Error checking enrollment:", error)
      } finally {
        setLoading(false)
      }
    }

    checkEnrollment()
  }, [user, courseId, supabase])

  const handleEnroll = async () => {
    if (!user) {
      router.push("/auth")
      return
    }

    setEnrolling(true)

    try {
      const { error } = await supabase.from("course_enrollments").insert({
        user_id: user.id,
        course_id: courseId,
      })

      if (!error) {
        setIsEnrolled(true)
        router.refresh()
      }
    } catch (error) {
      console.error("Error enrolling in course:", error)
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (isEnrolled) {
    return (
      <Button className="w-full bg-green-700 hover:bg-green-800" onClick={() => router.push("/dashboard/courses")}>
        Go to Course
      </Button>
    )
  }

  return (
    <Button className="w-full bg-yellow-500 hover:bg-yellow-600" onClick={handleEnroll} disabled={enrolling}>
      {enrolling ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enrolling...
        </>
      ) : (
        "Enroll Now"
      )}
    </Button>
  )
}
