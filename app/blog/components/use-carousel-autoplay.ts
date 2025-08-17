'use client';

import { useEffect, useRef } from 'react';
import { type CarouselApi } from '@/components/ui/carousel';

export function useCarouselAutoplay(api: CarouselApi | null) {
  const autoplayRef = useRef<NodeJS.Timeout>();

  const autoplay = () => {
    if (api) {
      const timeout = setTimeout(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
        autoplay();
      }, 5000); // 5 seconds interval
      autoplayRef.current = timeout;
    }
  };

  useEffect(() => {
    if (!api) return;

    autoplay();

    api.on('pointerDown', () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    });

    api.on('pointerUp', () => {
      autoplay();
    });

    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [api]);
}
