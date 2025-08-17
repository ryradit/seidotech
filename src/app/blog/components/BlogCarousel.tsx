'use client';

import { useState, useEffect } from 'react';
import Image from "next/image"
import Link from "next/link"
import { type Post } from "../../../lib/blog"
import { Play, Pause, Clock } from "lucide-react"
import { cn } from "../../../lib/utils"

interface BlogCarouselProps {
  featuredPosts: Post[]
}

export function BlogCarousel({ featuredPosts }: BlogCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, featuredPosts.length]);

  if (!featuredPosts?.length) return null;

  const currentPost = featuredPosts[currentIndex];

  return (
    <div className="relative w-full bg-gray-900 rounded-xl overflow-hidden">
      <div className="relative aspect-[16/9] md:aspect-[2/1] lg:aspect-[2.5/1]">
        {currentPost.featured_image && (
          <Image
            src={currentPost.featured_image}
            alt={currentPost.title}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/20" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <div className="flex items-center space-x-2 text-white/80 text-sm mb-3">
            <Clock className="h-4 w-4" />
            <span>5 min read</span>
          </div>
          <Link href={`/blog/${currentPost.slug}`} className="group">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
              {currentPost.title}
            </h2>
            <p className="text-white/80 text-sm md:text-base mb-6 line-clamp-2 max-w-2xl">
              {currentPost.excerpt}
            </p>
          </Link>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {featuredPosts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    idx === currentIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/80"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-white" />
              ) : (
                <Play className="h-4 w-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
