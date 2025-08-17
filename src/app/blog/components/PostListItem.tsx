'use client';

import Image from 'next/image';
import { Clock } from 'lucide-react';
import { type Post } from '../../../lib/blog';
import Link from 'next/link';
import { Badge } from '../../../components/ui/badge';
import { POST_CATEGORIES } from '../../../lib/constants';

interface PostListItemProps {
  post: Post;
}

export function PostListItem({ post }: PostListItemProps) {
  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="block"
    >
      <article className="flex items-start gap-8 p-6 group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all">
        {/* Thumbnail */}
        <div className="relative w-[200px] h-[134px] flex-shrink-0 overflow-hidden rounded-lg">
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="200px"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500">No image</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 py-1">
          <div className="flex gap-2 mb-3">
            <Badge variant="orange">{post.category || POST_CATEGORIES.LAYANAN}</Badge>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-orange-500 transition-colors line-clamp-2 mb-3">
            {post.title}
          </h3>
          
          <p className="text-base text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>5 menit baca</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
