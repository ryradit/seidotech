'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 p-2 bg-primary text-white rounded-full shadow-lg transition-all duration-300 hover:bg-primary/90 hover:scale-110"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
