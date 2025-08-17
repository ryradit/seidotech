import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, User } from "lucide-react"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { type Post } from "@/lib/blog"

interface BlogGridProps {
  posts: Post[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Belum ada artikel yang diterbitkan.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link href={`/blog/${post.slug}`} key={post.id}>
          <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-none bg-white">
            {post.featured_image && (
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {formatDate(post.published_at || post.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
              </div>
              <CardTitle className="group-hover:text-blue-600 transition-colors text-xl">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">
                {post.excerpt || post.content.slice(0, 150)}...
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
