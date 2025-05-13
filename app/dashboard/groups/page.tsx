import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Globe, MessageSquare, ChevronRight } from "lucide-react"

export default async function DashboardGroupsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's group memberships
  const { data: memberships } = await supabase
    .from("group_memberships")
    .select("*, groups(*)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  // Fetch popular groups for discovery
  const { data: popularGroups } = await supabase
    .from("groups")
    .select("*")
    .order("member_count", { ascending: false })
    .limit(6)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Groups</h1>

      <Tabs defaultValue="joined" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="joined">Joined Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="joined">
          {memberships && memberships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberships.map((membership) => {
                const group = membership.groups
                if (!group) return null
                
                return (
                  <Card key={membership.id} className="overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-green-700 relative flex items-center justify-center">
                      <Users className="h-12 w-12 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{group.name}</CardTitle>
                      <CardDescription>{group.description?.substring(0, 100)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{group.member_count || '0'} members</span>
                        </div>
                        {group.is_private && (
                          <Badge className="bg-gray-100 text-gray-800">
                            Private Group
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" className="w-full justify-between" asChild>
                        <Link href={`/groups/${group.id}`}>
                          View Group <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">You haven't joined any groups yet.</p>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/groups">Browse Groups</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover">
          {popularGroups && popularGroups.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularGroups.map((group) => (
                  <Card key={group.id} className="overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-green-700 relative flex items-center justify-center">
                      <Globe className="h-12 w-12 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{group.name}</CardTitle>
                      <CardDescription>{group.description?.substring(0, 100)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{group.member_count || '0'} members</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{Math.floor(Math.random() * 20) + 1} discussions</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/groups/${group.id}`}>
                          View Group
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link href="/groups">View All Groups</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No groups available at the moment.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 