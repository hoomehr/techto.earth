import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { BookOpen, Calendar, Users, Plus, Edit, PlusCircle } from "lucide-react"
import EmailVerificationBanner from "@/components/dashboard/email-verification-banner"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Default values in case of database errors
  let enrollments = []
  let registrations = []
  let memberships = []
  let error = null

  try {
    // Try to get user's courses, events, and groups
    const { data: enrollmentsData, error: enrollmentsError } = 
      await supabase.from("course_enrollments").select("*").eq("user_id", user?.id)
    
    if (!enrollmentsError) {
      enrollments = enrollmentsData || []
    }

    const { data: registrationsData, error: registrationsError } = 
      await supabase.from("event_registrations").select("*").eq("user_id", user?.id)
    
    if (!registrationsError) {
      registrations = registrationsData || []
    }

    const { data: membershipsData, error: membershipsError } = 
      await supabase.from("group_memberships").select("*").eq("user_id", user?.id)
    
    if (!membershipsError) {
      memberships = membershipsData || []
    }

    // Check if we have any table errors
    if (enrollmentsError?.code === '42P01' || 
        registrationsError?.code === '42P01' || 
        membershipsError?.code === '42P01') {
      error = "Database tables not found. Please run the setup script.";
    }
  } catch (e) {
    console.error("Error fetching user data:", e)
    error = "Failed to load dashboard data."
  }

  // Check if email is verified (based on user metadata)
  const isEmailVerified = user?.email_confirmed_at 
    || user?.app_metadata?.email_confirmed_at 
    || user?.user_metadata?.email_verified 
    || (user?.app_metadata?.provider !== 'email'); // OAuth users are considered verified

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {!isEmailVerified && user?.email && (
        <EmailVerificationBanner userEmail={user.email} />
      )}

      {error && (
        <Card className="mb-8 bg-yellow-50 border-yellow-200 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-yellow-200/40">
          <CardHeader>
            <CardTitle className="text-yellow-800">Setup Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">{error}</p>
            <p className="text-yellow-700 mt-2">
              To set up your database tables, run: <code className="bg-yellow-100 px-2 py-1 rounded">node scripts/setup-database.js</code>
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-green-200/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Enrolled courses</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-yellow-200/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Events</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Registered events</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-green-200/40">
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

      <h2 className="text-2xl font-bold mb-4">Create Content</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Course Creation Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-green-200/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-green-600" />
              <CardTitle>Create Course</CardTitle>
            </div>
            <CardDescription>Share your knowledge with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Create a new course to help others transition from tech to earth-based careers. You can add content, materials, and resources.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
              <Link href="/dashboard/courses/create">
                <Plus className="mr-2 h-4 w-4" /> Create New Course
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Event Creation Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-yellow-200/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-yellow-600" />
              <CardTitle>Create Event</CardTitle>
            </div>
            <CardDescription>Organize events for the community</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Host workshops, meetups, or webinars to connect with fellow professionals transitioning to earth-based careers.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600" asChild>
              <Link href="/dashboard/events/create">
                <Plus className="mr-2 h-4 w-4" /> Create New Event
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
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
