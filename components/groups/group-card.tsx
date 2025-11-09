"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, MessageSquare, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { getImageUrl } from "@/lib/image-utils"

type GroupCardProps = {
  group: any
}

export default function GroupCard({ group }: GroupCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [joining, setJoining] = useState(false)

  const handleJoin = async () => {
    if (!user) {
      router.push("/auth")
      return
    }

    setJoining(true)

    try {
      const { error } = await supabase.from("group_memberships").insert({
        user_id: user.id,
        group_id: group.id,
      })

      if (!error) {
        router.push(`/career-path/groups/${group.id}`)
        router.refresh()
      }
    } catch (error) {
      console.error("Error joining group:", error)
    } finally {
      setJoining(false)
    }
  }

  // Format category for display
  const categoryMap: Record<string, string> = {
    farming: "Farming & Agriculture",
    food: "Food & Restaurants",
    crafts: "Crafts & Trades",
    sustainability: "Sustainability",
  }

  return (
    <Link href={`/career-path/groups/${group.id}`} className="block hover:no-underline">
      <Card className="overflow-hidden transition-all duration-300 h-full group hover:shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:translate-y-[-5px]">
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
          <Image
            src={getImageUrl(group.image_url, group.category) || "/placeholder.svg?height=400&width=600"}
            alt={group.name || "Group image"}
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
          <CardTitle>{group.name}</CardTitle>
          <CardDescription>{group.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              {Math.floor(Math.random() * 1000) + 100} members
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              {group.location || "Online + Local Chapters"}
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-600" />
              {Math.floor(Math.random() * 100) + 10} active discussions
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={(e) => {
              e.preventDefault()
              handleJoin()
            }}
            disabled={joining}
          >
            {joining ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join Group"
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
