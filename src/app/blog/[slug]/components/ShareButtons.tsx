'use client';

import { useEffect, useState } from 'react';
import { Facebook, Linkedin, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../../../lib/utils';

// X (formerly Twitter) icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

interface ShareButtonsProps {
  title: string;
  className?: string;
}

export default function ShareButtons({ title, className }: ShareButtonsProps) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const shareText = `Check out this article: ${title}`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('URL copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const shareButtons = [
    {
      icon: Facebook,
      label: 'Share on Facebook',
      onClick: () => window.open(shareLinks.facebook, '_blank'),
      className: 'hover:bg-[#1877f2] hover:border-[#1877f2]',
    },
    {
      icon: XIcon,
      label: 'Share on X',
      onClick: () => window.open(shareLinks.twitter, '_blank'),
      className: 'hover:bg-black hover:border-black',
    },
    {
      icon: Linkedin,
      label: 'Share on LinkedIn',
      onClick: () => window.open(shareLinks.linkedin, '_blank'),
      className: 'hover:bg-[#0077b5] hover:border-[#0077b5]',
    },
    {
      icon: Link2,
      label: 'Copy Link',
      onClick: copyToClipboard,
      className: cn(
        'hover:bg-gray-900 hover:border-gray-900',
        copied && 'bg-gray-900 border-gray-900'
      ),
    },
  ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-2">
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {shareButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full border border-gray-200",
              "transition-all duration-200 ease-in-out",
              "hover:text-white group",
              button.className
            )}
            aria-label={button.label}
          >
            <button.icon className={cn(
              "w-4 h-4 transition-all",
              "group-hover:scale-110 group-hover:text-white",
              copied && button.icon === Link2 && "text-white scale-110"
            )} />
          </button>
        ))}
      </div>
    </div>
  );
}
