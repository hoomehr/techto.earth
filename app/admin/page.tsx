"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/context/admin-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, BookOpen, Calendar, User, Lock, Unlock, ChevronLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

export default function AdminPage() {
  const router = useRouter()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const { user } = useAuth()
  const supabase = createClient()
  
  const [users, setUsers] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Check if the user is admin, redirect if not
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/dashboard')
    }
  }, [isAdmin, adminLoading, router])
  
  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return
      
      setLoading(true)
      
      try {
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .rpc('get_all_users')
          .limit(10)
        
        if (!usersError && usersData) {
          setUsers(usersData)
        } else {
          // Fallback if RPC doesn't exist
          const { data: fallbackUsersData } = await supabase
            .from('profiles')
            .select('*')
            .limit(10)
          
          setUsers(fallbackUsersData || [])
        }
        
        // Fetch courses
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
        
        setCourses(coursesData || [])
        
        // Fetch events
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
        
        setEvents(eventsData || [])
        
        // Fetch groups
        const { data: groupsData } = await supabase
          .from('groups')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
        
        setGroups(groupsData || [])
      } catch (error) {
        console.error('Error fetching admin data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [isAdmin, supabase])
  
  // Toggle publish status for a course
  const toggleCoursePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !currentStatus })
        .eq('id', courseId)
      
      if (!error) {
        setCourses(prevCourses => prevCourses.map(
          course => course.id === courseId 
            ? { ...course, is_published: !currentStatus } 
            : course
        ))
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }
  
  // Toggle admin role for a user
  const toggleAdminRole = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      const newRole = isCurrentlyAdmin ? 'user' : 'admin'
      
      const { error } = await supabase.rpc('set_user_role', {
        user_id: userId,
        new_role: newRole
      })
      
      if (!error) {
        setUsers(prevUsers => prevUsers.map(
          u => u.id === userId 
            ? { ...u, role: newRole } 
            : u
        ))
      }
    } catch (error) {
      console.error('Error toggling admin role:', error)
    }
  }
  
  // If still checking admin status or not an admin, show loading
  if (adminLoading || !isAdmin) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold flex items-center">
          <Shield className="mr-2 h-6 w-6 text-yellow-600" />
          Admin Panel
        </h1>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="courses">
            <BookOpen className="mr-2 h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>View and manage user accounts and roles</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableCaption>List of recent users</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name || user.email?.split('@')[0] || 'Unknown'}</TableCell>
                        <TableCell>{user.email || 'No email'}</TableCell>
                        <TableCell>
                          <Badge className={
                            user.role === 'admin' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                          }>
                            {user.role || 'user'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant={user.role === 'admin' ? "destructive" : "outline"}
                            onClick={() => toggleAdminRole(user.id, user.role === 'admin')}
                            disabled={user.id === user?.id} // Prevent changing own role
                          >
                            {user.role === 'admin' ? (
                              <>
                                <Lock className="mr-1 h-3 w-3" />
                                Remove Admin
                              </>
                            ) : (
                              <>
                                <Unlock className="mr-1 h-3 w-3" />
                                Make Admin
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Courses Tab */}
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Courses Management</CardTitle>
              <CardDescription>Manage course visibility and status</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableCaption>List of recent courses</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map(course => (
                      <TableRow key={course.id}>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.category}</TableCell>
                        <TableCell>{course.created_by}</TableCell>
                        <TableCell>
                          <Badge className={
                            course.is_published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }>
                            {course.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleCoursePublish(course.id, course.is_published)}
                          >
                            {course.is_published ? 'Unpublish' : 'Publish'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Events Management</CardTitle>
              <CardDescription>View and manage upcoming events</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableCaption>List of recent events</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map(event => (
                      <TableRow key={event.id}>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{new Date(event.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={
                            event.is_published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }>
                            {event.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={`/events/${event.id}`}>
                            <Button size="sm" variant="outline">View Details</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Badge component for admin panel
function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>
      {children}
    </span>
  )
} 