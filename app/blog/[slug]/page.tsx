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
  // Ensure slug is valid
  if (!params?.slug) {
    return {
      title: "Blog Post Not Found",
    }
  }

  try {
    const supabase = await createClient()
    const { data: post } = await supabase.from("blog_posts").select("title, excerpt, featured_image").eq("slug", params.slug).single()

    if (!post) {
      return {
        title: "Blog Post Not Found",
      }
    }

    return {
      title: `${post.title} | TechTo.Earth Blog`,
      description: post.excerpt,
      openGraph: {
        images: post.featured_image ? [post.featured_image] : [],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Blog Post - TechTo.Earth",
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Ensure slug is valid
  if (!params?.slug) {
    notFound()
  }

  try {
    const supabase = await createClient()

    // Fetch the blog post
    const { data: post } = await supabase
      .from("blog_posts")
      .select("id, title, slug, content, excerpt, published_at, featured_image, author_id")
      .eq("slug", params.slug)
      .eq("published", true)
      .single()

    if (!post) {
      notFound()
    }

    // Fetch author info
    const { data: author } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", post.author_id)
      .single()

    // Convert markdown to HTML - safely handle case where content is empty or undefined
    const content = post.content ? marked(post.content) : ''

    return (
      <div className="container py-12">
        <Link href="/blog" className="flex items-center text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.published_at || ""}>
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : "No date"}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>By {author?.full_name || "Unknown Author"}</span>
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
        </article>
      </div>
    )
  } catch (error) {
    console.error("Error in blog post page:", error)
    return (
      <div className="container py-12">
        <Link href="/blog" className="flex items-center text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Blog post not available</h1>
          <p className="text-gray-500">This blog post is currently unavailable. Please check back later.</p>
        </div>
      </div>
    )
  }
}
