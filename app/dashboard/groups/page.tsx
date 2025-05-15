import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Globe, MessageSquare, ChevronRight, Plus } from "lucide-react"

// Define types for our data
type GroupType = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  location: string;
  category: string;
  is_private: boolean;
  created_at: string;
}

type GroupMembershipType = {
  id: string;
  user_id: string;
  group_id: string;
  role: string;
  joined_at: string;
  group: GroupType;
}

export default async function DashboardGroupsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's group memberships with proper join
  const { data: rawMembershipGroups, error: membershipError } = await supabase
    .from("group_memberships")
    .select(`
      id, 
      user_id, 
      group_id, 
      role, 
      joined_at,
      group:groups(*)
    `)
    .eq("user_id", user?.id)
    .order("joined_at", { ascending: false })

  console.log("Raw group memberships:", JSON.stringify(rawMembershipGroups?.slice(0, 1), null, 2))

  // Process data to handle the group property correctly
  const membershipGroups = rawMembershipGroups?.map(membership => {
    let group = null;
    
    // Handle different ways Supabase might return the joined data
    if (Array.isArray(membership.group)) {
      // If it's an array (common with joins), take the first item
      group = membership.group.length > 0 ? membership.group[0] : null;
    } else if (typeof membership.group === 'object' && membership.group !== null) {
      // If it's already an object, use it directly
      group = membership.group;
    }
    
    return {
      ...membership,
      group
    };
  }) || [];

  console.log("Processed groups:", membershipGroups.slice(0, 1).map(m => ({id: m.id, groupId: m.group_id, group: m.group ? {id: m.group.id, name: m.group.name} : null})))

  // Fetch popular groups for discovery
  const { data: popularGroups } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6)

  // Count members per group (to replace missing member_count)
  const groupIds = popularGroups?.map(group => group.id) || []
  let groupMemberCounts: Record<string, number> = {}
  
  if (groupIds.length > 0) {
    // Use count aggregation correctly
    for (const groupId of groupIds) {
      const { count } = await supabase
        .from('group_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId);
        
      if (count !== null) {
        groupMemberCounts[groupId] = count;
      }
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Groups</h1>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Your Communities</h2>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/dashboard/groups/create">
            <Plus className="mr-2 h-4 w-4" /> Create New Group
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="joined" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="joined">Joined Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="joined">
          {membershipError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
              <p>Error loading groups: {membershipError.message}</p>
            </div>
          )}

          {membershipGroups && membershipGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {membershipGroups.map((membership) => {
                const group = membership.group;
                
                if (!group) {
                  console.log(`Group not found for membership ${membership.id}, group_id: ${membership.group_id}`);
                  return null;
                }
                
                return (
                  <Card key={membership.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-green-200/40">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-green-700 relative flex items-center justify-center">
                      <Users className="h-12 w-12 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{group.name || 'Untitled Group'}</CardTitle>
                      <CardDescription>{group.description?.substring(0, 100) || 'No description available'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{membership.role || 'Member'}</span>
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
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
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
                  <Card key={group.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:shadow-green-200/40">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-green-700 relative flex items-center justify-center">
                      <Globe className="h-12 w-12 text-white/50" />
                    </div>
                    <CardHeader>
                      <CardTitle>{group.name || 'Untitled Group'}</CardTitle>
                      <CardDescription>{group.description?.substring(0, 100) || 'No description available'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-500">{groupMemberCounts[group.id] || 0} members</span>
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
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
              <p className="text-gray-500">No groups available at the moment.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 