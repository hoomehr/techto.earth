"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

type JoinGroupButtonProps = {
  groupId: string
}

export default function JoinGroupButton({ groupId }: JoinGroupButtonProps) {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [joining, setJoining] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkMembership = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data } = await supabase
          .from("group_memberships")
          .select("*")
          .eq("user_id", user.id)
          .eq("group_id", groupId)
          .single()

        setIsMember(!!data)
      } catch (error) {
        console.error("Error checking membership:", error)
      } finally {
        setLoading(false)
      }
    }

    checkMembership()
  }, [user, groupId, supabase])

  const handleJoin = async () => {
    if (!user) {
      router.push("/auth")
      return
    }

    setJoining(true)

    try {
      const { error } = await supabase.from("group_memberships").insert({
        user_id: user.id,
        group_id: groupId,
      })

      if (!error) {
        setIsMember(true)
        router.refresh()
      }
    } catch (error) {
      console.error("Error joining group:", error)
    } finally {
      setJoining(false)
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

  if (isMember) {
    return (
      <Button className="w-full bg-green-700 hover:bg-green-800" onClick={() => router.push("/dashboard/groups")}>
        You're a Member
      </Button>
    )
  }

  return (
    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleJoin} disabled={joining}>
      {joining ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Joining...
        </>
      ) : (
        "Join Group"
      )}
    </Button>
  )
}
