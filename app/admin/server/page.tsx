import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { getAllUsers } from "@/utils/admin-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Users } from "lucide-react"

export default async function AdminServerPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  // Get all users (this will only work if the user is an admin)
  const users = await getAllUsers(user?.id)
  
  // Get system statistics
  const { count: coursesCount } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })
  
  const { count: eventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
  
  const { count: groupsCount } = await supabase
    .from('groups')
    .select('*', { count: 'exact', head: true })
  
  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" asChild>
          <Link href="/admin">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Admin Panel
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Server Admin Page</h1>
      </div>
      
      <p className="text-gray-500 mb-8">
        This page demonstrates server-side admin functionality using the admin utilities.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Total registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>Total courses in the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{coursesCount || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Total events and groups</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{(eventsCount || 0) + (groupsCount || 0)}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Users (Server-Side)
            </div>
          </CardTitle>
          <CardDescription>List of users retrieved on the server</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <ul className="divide-y">
              {users.map(user => (
                <li key={user.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{user.full_name || user.email?.split('@')[0] || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No users found or you don't have admin permissions.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 