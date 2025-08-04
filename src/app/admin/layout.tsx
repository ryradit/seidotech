
'use client';

import { useAuth } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/components/protected-route';
import { AdminNavbar } from '@/components/admin/admin-navbar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { usePathname } from 'next/navigation';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AdminNavbar />
          <SidebarInset className="flex-1">
            <header className="flex items-center p-2 md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold ml-2 text-slate-900 dark:text-slate-100">Admin</h1>
            </header>
            <ProtectedRoute>
              <div className="flex-1">
                {children}
              </div>
            </ProtectedRoute>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) {
      if (pathname === '/admin/login') {
        return <>{children}</>;
      }
      return <AdminLayoutContent>{children}</AdminLayoutContent>;
    }
    
    return <>{children}</>;
}
