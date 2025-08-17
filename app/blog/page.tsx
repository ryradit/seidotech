import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { type Post } from "@/lib/blog"
import { PostListItem } from "./components/PostListItem"
import { GridLayout } from "./components/GridLayouts"
import { Pagination } from "./components/Pagination"
import { Badge } from "@/components/ui/badge"
import { POST_CATEGORIES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Footer } from "@/components/footer"

// Force dynamic rendering for real-time data
export const revalidate = 0

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { page?: string; category?: string }
}) {
  // Get current page and category from URL params
  const currentPage = Number(searchParams?.page) || 1;
  const currentCategory = searchParams?.category;
  const itemsPerPage = 5;
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  
  const supabase = createServerComponentClient({ cookies });
  
  // Fetch featured posts
  const { data: featuredPosts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6); // 1 main + 5 side posts

  // Fetch paginated list posts
  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("status", "published");
    
  // Add category filter if selected
  if (currentCategory) {
    query = query.eq("category", currentCategory);
  }
  
  const { data: listPosts, count } = await query
    .order("published_at", { ascending: false })
    .range(from, to);

  if (!featuredPosts || !listPosts) return null;

  const [featuredMain, ...featuredSide] = featuredPosts as Post[];

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {/* Featured Articles Grid */}
        <section className="container mx-auto">
          <GridLayout 
            posts={[featuredMain, ...featuredSide]} 
            variant="layout1"  // You can change this to layout1, layout2, layout3, layout4, or layout5
          />
        </section>

        {/* Latest Articles Section */}
        <section className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Artikel Terbaru</h2>
              <p className="text-muted-foreground mt-1">
                Tetap update dengan wawasan terbaru kami
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Link href="/blog" className={cn(
              "transition-colors",
              !currentCategory && "pointer-events-none"
            )}>
              <Badge variant={!currentCategory ? "orange" : "secondary"} className="cursor-pointer">
                Semua
              </Badge>
            </Link>
            {Object.values(POST_CATEGORIES).map((category) => (
              <Link 
                key={category}
                href={`/blog?category=${category}`}
                className={cn(
                  "transition-colors",
                  currentCategory === category && "pointer-events-none"
                )}
              >
                <Badge 
                  variant={currentCategory === category ? "orange" : "secondary"}
                  className="cursor-pointer"
                >
                  {category}
                </Badge>
              </Link>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 shadow-sm">
            {listPosts.map((post, index) => (
              <div key={post.id}>
                <PostListItem post={post} />
                {index < listPosts.length - 1 && <div className="h-px bg-gray-200 dark:bg-gray-800 mx-6" />}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Pagination 
              totalItems={count || 0}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              baseUrl={currentCategory ? `/blog?category=${currentCategory}&` : '/blog?'}
            />
          </div>
        </div>
      </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
