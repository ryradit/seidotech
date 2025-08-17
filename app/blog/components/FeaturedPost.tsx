'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { type Post } from '@/lib/blog';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { POST_CATEGORIES } from '@/lib/constants';

interface FeaturedPostProps {
  post: Post;
  variant?: 'large' | 'medium' | 'small';
  className?: string;
}

export function FeaturedPost({ post, variant = 'medium', className = '' }: FeaturedPostProps) {
  return (
    <Link 
      href={`/blog/${post.slug}`}
      className={cn(
        "group relative block overflow-hidden bg-gray-100 dark:bg-gray-800 h-full",
        className
      )}
    >
      <div className={cn(
        "relative w-full h-full",
        variant === 'large' ? 'aspect-[16/9]' : 'aspect-[4/3]'
      )}>
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={variant === 'large' ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 50vw, 33vw'}
            priority={variant === 'large'}
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
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="orange" className="text-xs">{post.category || POST_CATEGORIES.LAYANAN}</Badge>
            <div className="flex items-center space-x-2 text-white/80 text-sm">
              <Clock className="h-4 w-4" />
              <span>5 menit baca</span>
            </div>
          </div>
          
          <h2 className={cn(
            "font-bold text-white group-hover:text-orange-500 transition-colors line-clamp-2",
            variant === 'large' ? 'text-2xl md:text-3xl mb-2' : 'text-lg md:text-xl'
          )}>
            {post.title}
          </h2>
          
          {variant === 'large' && (
            <p className="text-white/80 text-sm md:text-base line-clamp-2 mt-2 max-w-2xl">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
