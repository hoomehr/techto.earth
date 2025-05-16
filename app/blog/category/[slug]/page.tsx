import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react"

interface BlogCategoryPageProps {
  params: {
    slug: string
  }
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  // Ensure slug is available and valid
  if (!params?.slug) {
    notFound()
  }

  try {
    const supabase = await createClient()

    // Fetch the category
    const { data: category } = await supabase
      .from("blog_categories")
      .select("id, name, slug, description")
      .eq("slug", params.slug)
      .single()

    if (!category) {
      notFound()
    }

    // Fetch all categories for the navigation
    const { data: categories = [] } = await supabase
      .from("blog_categories")
      .select("id, name, slug")

    // Try to fetch posts with this category using contains
    let posts: any[] = []
    try {
      const { data: categorizedPosts = [] } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, published_at, featured_image")
        .eq("published", true)
        .contains('categories', [category.id])
        .order("published_at", { ascending: false })
      
      posts = categorizedPosts || []
    } catch (err) {
      // Fallback: If the contains query fails (e.g. if categories column doesn't exist)
      // Use post_categories junction table
      const { data: postRelations = [] } = await supabase
        .from("blog_post_categories")
        .select("post_id")
        .eq("category_id", category.id)
      
      if (postRelations && postRelations.length > 0) {
        const postIds = postRelations.map(relation => relation.post_id)
        const { data: relatedPosts = [] } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, published_at, featured_image")
          .eq("published", true)
          .in('id', postIds)
          .order("published_at", { ascending: false })
        
        posts = relatedPosts || []
      }
    }

    return (
      <div className="container py-12">
        <Link href="/blog" className="flex items-center text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-gray-600">{category.description || 'Posts in this category'}</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Link href="/blog">
            <Button variant="outline" className="rounded-full">
              All
            </Button>
          </Link>
          {Array.isArray(categories) && categories.map((cat) => (
            <Link key={cat.id} href={`/blog/category/${cat.slug}`}>
              <Button
                variant={cat.id === category.id ? "default" : "outline"}
                className={cat.id === category.id ? "rounded-full bg-green-600" : "rounded-full"}
              >
                {cat.name}
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
            <p className="text-gray-500">No blog posts in this category yet. Check back soon!</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error in blog category page:", error)
    return (
      <div className="container py-12">
        <Link href="/blog" className="flex items-center text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Category not available</h1>
          <p className="text-gray-500">This category is currently unavailable. Please check back later.</p>
        </div>
      </div>
    )
  }
}
