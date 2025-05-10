import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Metadata } from "next"
import { marked } from "marked"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const supabase = createClient()
  const { data: post } = await supabase.from("blog_posts").select("*").eq("slug", params.slug).single()

  if (!post) {
    return {
      title: "Blog Post Not Found",
    }
  }

  return {
    title: `${post.title} | TechTo.Earth Blog`,
    description: post.excerpt,
    openGraph: {
      images: [post.featured_image],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = createClient()

  // Fetch the blog post
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*, author:author_id(id, full_name, avatar_url, username)")
    .eq("slug", params.slug)
    .eq("published", true)
    .single()

  if (!post) {
    notFound()
  }

  // Fetch the post categories
  const { data: postCategories } = await supabase
    .from("blog_post_categories")
    .select("category:category_id(id, name, slug)")
    .eq("post_id", post.id)

  // Convert markdown to HTML
  const content = marked(post.content)

  return (
    <div className="container py-12">
      <Link href="/blog" className="flex items-center text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog
      </Link>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {postCategories?.map((item) => (
              <Link key={item.category.id} href={`/blog/category/${item.category.slug}`}>
                <Button variant="outline" size="sm" className="rounded-full">
                  {item.category.name}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>By {post.author.full_name}</span>
            </div>
          </div>
        </header>

        {post.featured_image && (
          <div className="relative aspect-video w-full mb-8">
            <Image
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />

        <footer className="mt-12 pt-8 border-t">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              {post.author.avatar_url ? (
                <AvatarImage src={post.author.avatar_url || "/placeholder.svg"} alt={post.author.full_name} />
              ) : (
                <AvatarFallback className="bg-green-100 text-green-800">
                  {post.author.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold">{post.author.full_name}</h3>
              <p className="text-sm text-gray-500">
                Former tech professional who transitioned to an earth-based career.
              </p>
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}
