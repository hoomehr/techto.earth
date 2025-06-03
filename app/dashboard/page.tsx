import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Plus, 
  Edit, 
  PlusCircle, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Star, 
  Trophy,
  Target,
  Activity,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sprout,
  Utensils,
  Tractor
} from "lucide-react"
import EmailVerificationBanner from "@/components/dashboard/email-verification-banner"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default values in case of database errors
  let enrollments = []
  let registrations = []
  let memberships = []
  let recentCourses = []
  let upcomingEvents = []
  let userProfile = null
  let error = null

  try {
    // Get user's data with related course/event/group information
    const [
      { data: enrollmentsData, error: enrollmentsError },
      { data: registrationsData, error: registrationsError },
      { data: membershipsData, error: membershipsError },
      { data: coursesData },
      { data: eventsData },
      { data: profileData }
    ] = await Promise.all([
      supabase
        .from("course_enrollments")
        .select(`
          *,
          courses(id, title, category, level, created_at, instructor_name)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      
      supabase
        .from("event_registrations")
        .select(`
          *,
          events(id, title, start_date, location, event_type)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      
      supabase
        .from("group_memberships")
        .select(`
          *,
          groups(id, name, location, focus_area)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      
      supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(5),
      
      supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true })
        .limit(5),

      // Try to fetch extended profile data
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
    ])

    enrollments = enrollmentsData || []
    registrations = registrationsData || []
    memberships = membershipsData || []
    recentCourses = coursesData || []
    upcomingEvents = eventsData || []
    userProfile = profileData || null

    // Check if we have any table errors
    if (enrollmentsError?.code === '42P01' || 
        registrationsError?.code === '42P01') {
      error = "Database tables not found. Please run the setup script.";
    }
  } catch (e) {
    console.error("Error fetching user data:", e)
    error = "Failed to load dashboard data."
  }

  // Check if email is verified
  const isEmailVerified = user?.email_confirmed_at 
    || user?.app_metadata?.email_confirmed_at 
    || user?.user_metadata?.email_verified 
    || (user?.app_metadata?.provider !== 'email');

  // Calculate user stats and progress
  const totalEnrollments = enrollments?.length || 0
  const totalRegistrations = registrations?.length || 0
  const totalMemberships = memberships?.length || 0
  
  // Calculate categories distribution
  const categoryStats = enrollments?.reduce((acc, enrollment) => {
    const category = enrollment.courses?.category || 'Other'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // User's journey progress (simplified scoring system)
  const journeyScore = Math.min(100, (totalEnrollments * 15) + (totalRegistrations * 10) + (totalMemberships * 20))
  
  // Get user's name from profile or metadata
  const userName = userProfile?.full_name || 
                   user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   user.email?.split('@')[0] || 'there'
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  // Get user interests from profile
  const userInterests = userProfile?.career_interests || []

  // Quick stats for cards
  const stats = [
    {
      title: "Learning Progress",
      value: `${journeyScore}%`,
      description: "Journey completion",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Courses Enrolled",
      value: totalEnrollments,
      description: "Active learning",
      icon: BookOpen,
      color: "text-blue-600", 
      bgColor: "bg-blue-50"
    },
    {
      title: "Events Registered",
      value: totalRegistrations,
      description: "Upcoming events",
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Community Groups",
      value: totalMemberships,
      description: "Connected communities",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Personal Welcome Header */}
      <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-green-200">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-green-100 text-green-700 text-lg font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome back, {userName}! 🌱
              </h1>
              <p className="text-gray-600 mt-1">
                Continue your journey from tech to earth-based careers
              </p>
              {journeyScore > 0 && (
                <div className="flex items-center mt-3 space-x-3">
                  <div className="flex-1 max-w-xs">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Journey Progress</span>
                      <span className="font-medium text-green-600">{journeyScore}%</span>
                    </div>
                    <Progress value={journeyScore} className="h-2" />
                  </div>
                  {journeyScore >= 50 && (
                    <Badge className="bg-green-600 text-white">
                      <Trophy className="h-3 w-3 mr-1" />
                      Active Learner
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="font-medium">{formatDate(user.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Verification Banner */}
      {!isEmailVerified && user?.email && (
        <EmailVerificationBanner userEmail={user.email} />
      )}

      {/* Database Error Banner */}
      {error && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">{error}</p>
            <p className="text-yellow-700 mt-2">
              To set up your database tables, run: <code className="bg-yellow-100 px-2 py-1 rounded">node scripts/setup-database.js</code>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Recent Activity & Progress */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest enrollments and registrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollments?.slice(0, 3).map((enrollment) => (
                <div key={enrollment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-green-100">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {enrollment.courses?.title || 'Course'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Enrolled {formatDate(enrollment.created_at)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {enrollment.courses?.category || 'Course'}
                  </Badge>
                </div>
              ))}
              
              {registrations?.slice(0, 2).map((registration) => (
                <div key={registration.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-yellow-100">
                    <Calendar className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {registration.events?.title || 'Event'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Registered {formatDate(registration.created_at)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {registration.events?.event_type || 'Event'}
                  </Badge>
                </div>
              ))}
              
              {enrollments?.length === 0 && registrations?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No recent activity yet</p>
                  <p className="text-sm">Start by enrolling in a course or registering for an event!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-2 text-green-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Share your knowledge and connect with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-auto p-4 bg-green-600 hover:bg-green-700 text-left justify-start" asChild>
                  <Link href="/dashboard/courses/create" className="flex items-start space-x-3">
                    <BookOpen className="h-6 w-6 mt-1" />
                    <div>
                      <div className="font-medium">Create Course</div>
                      <div className="text-sm text-green-100">Share your expertise</div>
                    </div>
                  </Link>
                </Button>
                
                <Button className="h-auto p-4 bg-yellow-500 hover:bg-yellow-600 text-left justify-start" asChild>
                  <Link href="/dashboard/events/create" className="flex items-start space-x-3">
                    <Calendar className="h-6 w-6 mt-1" />
                    <div>
                      <div className="font-medium">Host Event</div>
                      <div className="text-sm text-yellow-100">Organize a meetup</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Recommendations & Upcoming */}
        <div className="space-y-6">
          
          {/* Recommended for You */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Recommended for You
              </CardTitle>
              <CardDescription>Based on your interests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCourses?.slice(0, 3).map((course) => (
                <div key={course.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">{course.title}</h4>
                      <p className="text-xs text-gray-500 mb-2">{course.instructor_name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {course.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/courses/${course.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/courses">
                  Browse All Courses <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Don't miss these opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents?.slice(0, 3).map((event) => (
                <div key={event.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{event.title}</h4>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(event.start_date)}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </div>
                  )}
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href={`/events/${event.id}`}>
                      Learn More
                    </Link>
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/events">
                  View All Events <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Journey Progress */}
          {journeyScore > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Your Journey
                </CardTitle>
                <CardDescription>Track your transition progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <span className="text-sm font-medium">{journeyScore}%</span>
                  </div>
                  <Progress value={journeyScore} className="h-3" />
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className={`p-2 rounded ${totalEnrollments > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                      <Sprout className="h-4 w-4 mx-auto mb-1" />
                      <div>Learn</div>
                    </div>
                    <div className={`p-2 rounded ${totalRegistrations > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-500'}`}>
                      <Utensils className="h-4 w-4 mx-auto mb-1" />
                      <div>Connect</div>
                    </div>
                    <div className={`p-2 rounded ${totalMemberships > 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>
                      <Tractor className="h-4 w-4 mx-auto mb-1" />
                      <div>Grow</div>
                    </div>
                  </div>
                  
                  {journeyScore < 30 && (
                    <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                      💡 <strong>Next steps:</strong> Enroll in your first course or join a community group to accelerate your transition!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
