import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Users } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's courses, events, and groups
  const { data: enrollments } = await supabase.from("course_enrollments").select("*").eq("user_id", user?.id)

  const { data: registrations } = await supabase.from("event_registrations").select("*").eq("user_id", user?.id)

  const { data: memberships } = await supabase.from("group_memberships").select("*").eq("user_id", user?.id)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Enrolled courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Events</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Registered events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Groups</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberships?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Joined groups</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to TechTo.Earth</CardTitle>
            <CardDescription>Your journey from tech to earth-based careers starts here</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Use your dashboard to track your courses, events, and groups. You can also create new content to share
              with the community.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
