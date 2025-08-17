'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  baseUrl?: string;
}

export function Pagination({ totalItems, itemsPerPage, currentPage, baseUrl = '/blog?' }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    return `${baseUrl}page=${pageNumber}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of current page group
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the start or end
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center space-x-2 mt-8">
      <Link
        href={createPageURL(Math.max(1, currentPage - 1))}
        className={cn(
          "p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800",
          currentPage === 1 && "pointer-events-none opacity-50"
        )}
      >
        Sebelumnya
      </Link>

      {getPageNumbers().map((pageNumber, idx) => (
        <Link
          key={idx}
          href={pageNumber === '...' ? '#' : createPageURL(pageNumber)}
          className={cn(
            "p-2 min-w-[40px] text-center border rounded",
            {
              'hover:bg-gray-100 dark:hover:bg-gray-800': pageNumber !== '...',
              'pointer-events-none': pageNumber === '...',
              'bg-orange-500 text-white': pageNumber === currentPage,
              'hover:bg-orange-600': pageNumber === currentPage,
            }
          )}
        >
          {pageNumber}
        </Link>
      ))}

      <Link
        href={createPageURL(Math.min(totalPages, currentPage + 1))}
        className={cn(
          "p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800",
          currentPage === totalPages && "pointer-events-none opacity-50"
        )}
      >
        Selanjutnya
      </Link>
    </nav>
  );
}
