import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, MapPin, MessageSquare, Users, ArrowLeft } from "lucide-react"
import JoinGroupButton from "@/components/groups/join-group-button"
import Link from "next/link"
import { getImageUrl } from "@/lib/image-utils"

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Fetch group details
  const { data: group } = await supabase.from("groups").select("*").eq("id", params.id).single()

  if (!group) {
    notFound()
  }

  // Fetch group creator
  const { data: creator } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url")
    .eq("id", group.created_by)
    .single()

  // Format category for display
  const categoryMap: Record<string, string> = {
    farming: "Farming & Agriculture",
    food: "Food & Restaurants",
    crafts: "Crafts & Trades",
    sustainability: "Sustainability",
  }

  // Count members
  const { count: memberCount } = await supabase
    .from("group_memberships")
    .select("*", { count: "exact", head: true })
    .eq("group_id", group.id)

  return (
    <div className="container py-8">
      <Link href="/groups" className="flex items-center text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Groups
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video w-full mb-6 rounded-lg overflow-hidden shadow-[0_5px_15px_rgba(22,163,74,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
            <Image
              src={getImageUrl(group.image_url, group.category) || "/placeholder.svg"}
              alt={group.name}
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold mb-4">{group.name}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-1 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <Globe className="h-4 w-4" />
              {categoryMap[group.category] || group.category}
            </div>
            {group.is_private && (
              <div className="flex items-center gap-1 text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                Private Group
              </div>
            )}
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-4">About This Group</h2>
            <p className="text-gray-700 mb-4">{group.description}</p>

            {creator && (
              <div className="mt-8 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Group Creator</h3>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-green-100">
                    {creator.avatar_url ? (
                      <Image
                        src={creator.avatar_url || "/placeholder.svg"}
                        alt={creator.full_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-green-800 font-bold">
                        {creator.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{creator.full_name}</p>
                    <p className="text-sm text-gray-500">@{creator.username || "user"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <JoinGroupButton groupId={group.id} />

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 py-2 border-b">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Members</p>
                    <p className="text-gray-600">{memberCount || 0} members</p>
                  </div>
                </div>
                {group.location && (
                  <div className="flex items-center gap-3 py-2 border-b">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{group.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 py-2 border-b">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Discussions</p>
                    <p className="text-gray-600">{Math.floor(Math.random() * 100) + 10} active discussions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-b">
                  <Globe className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Category</p>
                    <p className="text-gray-600">{categoryMap[group.category] || group.category}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
