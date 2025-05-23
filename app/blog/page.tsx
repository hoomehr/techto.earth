import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/server"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"

// Simplified page without complex data handling
export default async function BlogPage() {
  const supabase = await createClient()
  
  try {
    // Simple fetch with error handling
    const { data: posts = [] } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, published_at, featured_image")
      .eq("published", true)
      .order("published_at", { ascending: false })
  
    // Simple fetch for categories
    const { data: categories = [] } = await supabase
      .from("blog_categories")
      .select("id, name, slug")
  
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-green-600">Blog</span> & Success Stories
          </h1>
          <p className="text-lg text-gray-600">
            Insights, advice, and stories from tech professionals who have transitioned to earth-based careers.
          </p>
        </div>
  
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Link href="/blog">
            <Button variant="outline" className="rounded-full">
              All
            </Button>
          </Link>
          {Array.isArray(categories) && categories.map((category) => (
            <Link key={category.id} href={`/blog/category/${category.slug}`}>
              <Button variant="outline" className="rounded-full">
                {category.name}
              </Button>
            </Link>
          ))}
        </div>
  
        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(posts) && posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title || "Blog post"}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.published_at || ""}>
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : "No date"}
                  </time>
                </div>
                <CardTitle className="line-clamp-2">{post.title || "Untitled"}</CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt || "No excerpt available"}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" className="gap-2" asChild>
                  <Link href={`/blog/${post.slug || post.id}`}>
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
  
        {(!Array.isArray(posts) || posts.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available yet. Check back soon!</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error in blog page:", error)
    return (
      <div className="container py-12">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Blog</h1>
          <p className="text-gray-500">Our blog is currently unavailable. Please check back later.</p>
        </div>
      </div>
    )
  }
}
