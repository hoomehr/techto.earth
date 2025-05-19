import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, FileText, Trash } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardBlogPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's blog posts
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("author_id", user?.id)
    .order("created_at", { ascending: false })

  // Fetch recent public posts
  const { data: recentPosts } = await supabase
    .from("blog_posts")
    .select("*, profiles(full_name)")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Blog Posts</h1>

      <Tabs defaultValue="my-posts" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="my-posts">My Posts</TabsTrigger>
          <TabsTrigger value="recent">Recent Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="my-posts">
      {posts && posts.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    {post.published ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/blog/edit/${post.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" asChild>
                        <Link href={`/dashboard/blog/delete/${post.id}`}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Link>
                      </Button>
                      {post.published && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            View
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't created any blog posts yet.</p>
          <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/blog">Browse Blog</Link>
          </Button>
        </div>
      )}
        </TabsContent>

        <TabsContent value="recent">
          {recentPosts && recentPosts.length > 0 ? (
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      By {post.profiles?.full_name || 'Anonymous'} • 
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{post.excerpt || post.content?.substring(0, 150)}</p>
                    <Button variant="outline" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}

              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link href="/blog">View All Posts</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No published posts available yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
