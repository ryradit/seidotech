'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // Use main element instead of article
      const content = document.querySelector('main');
      if (!content) return;

      const contentBox = content.getBoundingClientRect();
      const totalHeight = contentBox.height - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    // Initial calculation
    updateProgress();
    
    // Add scroll listener
    window.addEventListener('scroll', updateProgress);
    
    // Add resize listener to recalculate on window resize
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div
        className="h-full bg-primary transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
