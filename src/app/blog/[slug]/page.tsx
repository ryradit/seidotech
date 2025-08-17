import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { CalendarIcon, ChevronLeft, User, Clock } from 'lucide-react';
import CommentSection from './components/CommentSection';
import { Button } from '@/components/ui/button';
import ReadingProgress from './components/ReadingProgress';
import styles from './styles.module.css';
import ShareButtons from './components/ShareButtons';
import TableOfContents from './components/TableOfContents';
import BackToTopButton from './components/BackToTopButton';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  if (!params?.slug) {
    return {
      title: 'Blog Post Not Found | Seido Tech',
    };
  }

  try {
    const post = await getPostBySlug(params.slug);
    return {
      title: `${post.title} | Seido Tech Blog`,
      description: post.excerpt || post.content.slice(0, 160),
      openGraph: post.featured_image
        ? {
            images: [post.featured_image],
          }
        : undefined,
    };
  } catch (error) {
    return {
      title: 'Blog Post Not Found | Seido Tech',
    };
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  if (!params?.slug) {
    notFound();
  }

  let post;
  let relatedPosts;
  
  try {
    post = await getPostBySlug(params.slug);
    // Get all posts and filter out the current one
    const allPosts = await getAllPosts();
    relatedPosts = allPosts
      .filter(p => p.slug !== params.slug)
      .slice(0, 3); // Get 3 related posts
  } catch (error) {
    notFound();
  }

  // Estimate reading time
  const wordsPerMinute = 200;
  const wordCount = post.content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return (
    <main className="min-h-screen bg-white">
      {/* Reading Progress */}
      <ReadingProgress />

      <div className="container mx-auto px-4 py-8">
        {/* Back to Blog Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali ke Blog
        </Link>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Column */}
          <div className="flex-1 max-w-3xl">
            {/* Featured Image */}
            {post.featured_image && (
              <div className="relative aspect-[16/9] mb-8 rounded-xl overflow-hidden">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg text-gray-600 mb-6">{post.excerpt}</p>
              )}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                )}
                {post.published_at && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <time dateTime={post.published_at}>
                      {formatDate(post.published_at)}
                    </time>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} menit baca</span>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <article className={`prose prose-lg max-w-none prose-headings:scroll-mt-20 ${styles.article}`}>
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }} 
                className="
                  text-gray-800
                  [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:text-lg
                  [&_p+p]:mt-6
                  prose-img:rounded-xl prose-img:my-8
                  prose-a:text-primary hover:prose-a:text-primary/80
                  prose-blockquote:border-l-4 prose-blockquote:border-primary/20 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
                  prose-h2:text-2xl prose-h2:font-bold prose-h2:text-gray-900 prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-xl prose-h3:font-semibold prose-h3:text-gray-900 prose-h3:mt-8 prose-h3:mb-4
                  [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:my-6
                  [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:my-6
                  [&_li]:my-2 [&_li]:ml-2
                  prose-pre:bg-gray-50 prose-pre:rounded-lg prose-pre:p-4
                  prose-code:text-primary prose-code:bg-gray-50 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5
                  [&_.text-left]:text-left
                  [&_.text-center]:text-center
                  [&_.text-right]:text-right
                  [&_.text-justify]:text-justify"
              />
            </article>

            {/* Comments Section */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <CommentSection postSlug={params.slug} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              <div className="bg-gray-50/50 rounded-xl p-6">
                <TableOfContents content={post.content} />
              </div>
              
              {/* Share Article Section */}
              <div className="bg-gray-50/50 rounded-xl p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Bagikan Artikel Ini</h3>
                <ShareButtons title={post.title} className="items-center" />
              </div>

              {/* Suggested Articles */}
              <div className="bg-gray-50/50 rounded-xl p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">ARTIKEL TERKAIT</h3>
                <div className="space-y-6">
                  {relatedPosts.map((post) => (
                    <Link 
                      href={`/blog/${post.slug}`} 
                      key={post.slug}
                      className="group block"
                    >
                      <div className="relative aspect-[16/9] mb-3 rounded-lg overflow-hidden">
                        {post.featured_image && (
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      {post.published_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(post.published_at)}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-gray-50/50 rounded-xl p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Butuh Konsultasi?</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Tim ahli kami siap membantu memberikan solusi terbaik untuk kebutuhan industri Anda.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/kontak">Hubungi Kami</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTopButton />
    </main>
  );
}
