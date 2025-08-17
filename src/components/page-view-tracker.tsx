"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { recordPageView } from "../lib/page-views";

export function PageViewTracker() {
  const pathname = usePathname();
  const recorded = useRef(false);
  
  useEffect(() => {
    // Reset the recorded flag when the path changes
    recorded.current = false;
  }, [pathname]);
  
  useEffect(() => {
    // Record the page view only once per page load
    if (!recorded.current && typeof window !== "undefined") {
      recordPageView(pathname);
      recorded.current = true;
    }
  }, [pathname]);
  
  // This component doesn't render anything
  return null;
}
