'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { type CarouselApi } from '@/components/ui/carousel';

interface SlideIndicatorsProps {
  api: CarouselApi | null;
  count: number;
  className?: string;
}

export function SlideIndicators({ api, count, className }: SlideIndicatorsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  if (count <= 1) return null;

  return (
    <div className={cn('flex gap-2 items-center justify-center', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          className={cn(
            'w-8 h-1 rounded-sm transition-all duration-300',
            selectedIndex === i
              ? 'bg-primary'
              : 'bg-border hover:bg-muted'
          )}
          onClick={() => api?.scrollTo(i)}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}
