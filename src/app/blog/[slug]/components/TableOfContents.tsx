'use client';

import { useEffect, useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { ChevronDown } from 'lucide-react';

interface TableOfContentsProps {
  content: string;
}

interface HeadingInfo {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingInfo[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  // Extract headings from content
  useEffect(() => {
    const extractHeadings = () => {
      const lines = content.split('\n');
      const headingRegex = /^(#{1,3})\s+(.+)$/;
      
      return lines
        .map((line, index) => {
          const match = line.match(headingRegex);
          if (match) {
            const level = match[1].length;
            const text = match[2];
            const id = `heading-${index}`;
            return { id, text, level };
          }
          return null;
        })
        .filter((heading): heading is HeadingInfo => heading !== null);
    };

    setHeadings(extractHeadings());
  }, [content]);

  // Update active heading on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    const headingElements = document.querySelectorAll('h1, h2, h3');
    headingElements.forEach((element) => observer.observe(element));

    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <Button
        variant="ghost"
        className="flex w-full items-center justify-between mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">Table of Contents</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Button>

      {isOpen && (
        <nav className="space-y-2">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`
                block text-sm transition-colors
                ${heading.level === 1 ? 'font-semibold' : ''}
                ${
                  heading.level > 1
                    ? `pl-${(heading.level - 1) * 4} text-muted-foreground`
                    : ''
                }
                ${
                  activeId === heading.id
                    ? 'text-primary'
                    : 'hover:text-primary'
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(`#${heading.id}`)?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
