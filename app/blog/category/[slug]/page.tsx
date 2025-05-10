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
  const supabase = createClient()

  // Fetch the category
  const { data: category } = await supabase.from("blog_categories").select("*").eq("slug", params.slug).single()

  if (!category) {
    notFound()
  }

  // Fetch all categories for the navigation
  const { data: categories } = await supabase.from("blog_categories").select("*")

  // Fetch posts in this category
  const { data: postCategories } = await supabase
    .from("blog_post_categories")
    .select("post:post_id(*)")
    .eq("category_id", category.id)

  // Extract the posts and filter out any null values
  const posts = postCategories
    ?.map((item) => item.post)
    .filter((post) => post && post.published)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

  return (
    <div className="container py-12">
      <Link href="/blog" className="flex items-center text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog
      </Link>

      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
        <p className="text-lg text-gray-600">{category.description}</p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <Link href="/blog">
          <Button variant="outline" className="rounded-full">
            All
          </Button>
        </Link>
        {categories?.map((cat) => (
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
        {posts?.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={post.featured_image || "/placeholder.svg?height=200&width=400"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" className="gap-2" asChild>
                <Link href={`/blog/${post.slug}`}>
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {posts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No blog posts in this category yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
