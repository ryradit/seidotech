'use client';

import { useAuth } from '@/hooks/use-auth';
import { useAdminNavbar } from './use-admin-navbar';
import { useState, useEffect } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Home, 
  LogOut, 
  MessageSquare, 
  Briefcase, 
  Handshake,
  Settings,
  Users,
  BarChart3,
  FileText,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface AdminNavbarProps {
  className?: string;
}

// Icon mapping for dynamic icon rendering
const iconMap = {
  Home,
  MessageSquare,
  Briefcase,
  Handshake,
  Settings,
  Users,
  BarChart3,
  FileText,
  Bell,
  HelpCircle
};

export function AdminNavbar({ className }: AdminNavbarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { navItems } = useAdminNavbar();
  const { state, toggleSidebar } = useSidebar();
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  const isCollapsed = state === 'collapsed';

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('id', { count: 'exact' })
          .eq('status', 'unread');
          
        if (error) throw error;
        setUnreadMessages(data?.length || 0);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadMessages();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('contact_messages_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contact_messages' }, 
        () => {
          fetchUnreadMessages();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };
  
  const getInitials = (email: string | null) => {
    if (!email) return 'A';
    return email.charAt(0).toUpperCase();
  };

  // Render navigation section with collapse support
  const renderNavSection = (title: string, items: any[], showSeparator = true) => (
    <>
      <SidebarGroup>
        {!isCollapsed && (
          <SidebarGroupLabel className="text-xs font-medium text-blue-200 mb-2 px-2">
            {title}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu className={isCollapsed ? 'space-y-1' : 'space-y-1'}>
            {items.map((item, index) => {
              const IconComponent = iconMap[item.title === 'Dashboard' ? 'Home' :
                                           item.title === 'Portfolio' ? 'Briefcase' :
                                           item.title === 'Mitra' ? 'Handshake' :
                                           item.title === 'Pesan Masuk' ? 'MessageSquare' :
                                           item.title === 'Analytics' ? 'BarChart3' :
                                           item.title === 'Users' ? 'Users' :
                                           item.title === 'Reports' ? 'FileText' :
                                           item.title === 'Settings' ? 'Settings' :
                                           item.title === 'Notifications' ? 'Bell' :
                                           'HelpCircle' as keyof typeof iconMap];
              
              // Set badge count for Pesan Masuk
              const badgeCount = item.title === 'Pesan Masuk' && unreadMessages > 0 
                ? unreadMessages.toString() 
                : item.badge;
              
              const isMessageItem = item.title === 'Pesan Masuk';
              const hasUnread = isMessageItem && unreadMessages > 0;
              
              const menuButton = (
                <SidebarMenuButton asChild isActive={item.isActive}>
                  <Link 
                    href={item.href} 
                    className={`flex items-center rounded-lg transition-all duration-200 
                      ${item.isActive 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-blue-100 hover:bg-navy-700 hover:text-white'
                      } group ${isCollapsed ? 'justify-center p-2 w-10 h-10 mx-auto' : 'gap-3 px-3 py-2.5'}`}
                  >
                    <div className="relative">
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                      {hasUnread && !isCollapsed && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.title}</span>
                        {badgeCount && (
                          <Badge 
                            variant="secondary" 
                            className={`ml-auto text-xs flex-shrink-0 ${
                              hasUnread 
                                ? 'bg-red-500 text-white animate-pulse' 
                                : 'bg-blue-200 text-navy-800'
                            }`}
                          >
                            {badgeCount}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                </SidebarMenuButton>
              );

              return (
                <SidebarMenuItem key={item.href} className={isCollapsed ? 'flex justify-center' : ''}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          {menuButton}
                          {item.title === 'Pesan Masuk' && unreadMessages > 0 && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="flex items-center gap-2">
                        {item.title}
                        {badgeCount && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              item.title === 'Pesan Masuk' && unreadMessages > 0
                                ? 'bg-red-500 text-white animate-pulse' 
                                : 'bg-blue-200 text-navy-800'
                            }`}
                          >
                            {badgeCount}
                          </Badge>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    menuButton
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {showSeparator && !isCollapsed && <Separator className="my-4 bg-navy-600" />}
      {showSeparator && isCollapsed && <div className="my-2" />}
    </>
  );

  return (
    <Sidebar className={`border-r border-navy-600 bg-navy-800 ${className}`} collapsible="icon">
      <SidebarContent className="bg-navy-800">
        {/* Header with Logo and Collapse Toggle */}
        <SidebarHeader className="border-b border-navy-600 bg-navy-800 p-4">
          {!isCollapsed && (
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image 
                  src="/seidoiconwhite.png" 
                  alt="Seido Logo" 
                  width={64} 
                  height={64}
                  className="object-contain"
                  priority
                />
              </div>
              <h2 className="text-white font-semibold mt-[-20px]">Seido Admin</h2>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image 
                  src="/seidoiconwhite.png" 
                  alt="Seido Logo" 
                  width={40} 
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? 'justify-center w-full' : ''}`}>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs text-blue-200 truncate">Admin Dashboard</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8 text-blue-200 hover:bg-navy-700 hover:text-white flex-shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isCollapsed && (
            <>
              <div className="flex flex-col items-center mt-4">
                <p className="text-xs text-white font-medium">Seido</p>
                <p className="text-xs text-white font-medium mb-2">Admin</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-8 w-8 text-blue-200 hover:bg-navy-700 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </SidebarHeader>

        {/* Navigation Sections */}
        <div className={`flex-1 overflow-y-auto py-4 ${isCollapsed ? 'px-1' : 'px-2'}`}>
          {renderNavSection('Main Menu', navItems.main, false)}
        </div>
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter className="border-t border-navy-600 bg-navy-800 p-4">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-9 w-9 ring-2 ring-blue-300">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt="Admin" />
                  <AvatarFallback className="bg-blue-200 text-navy-800 font-semibold">
                    {getInitials(user?.email)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div>
                  <p className="font-medium">{user?.user_metadata?.full_name || user?.email}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" target="_blank">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                Lihat Situs Utama
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="h-8 w-8 text-blue-200 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Logout
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 ring-2 ring-blue-300 flex-shrink-0">
                <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt="Admin" />
                <AvatarFallback className="bg-blue-200 text-navy-800 font-semibold">
                  {getInitials(user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate text-white">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <p className="text-xs text-blue-200 truncate">
                  Administrator
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="h-8 w-8 text-blue-200 hover:bg-red-600 hover:text-white transition-colors flex-shrink-0"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <Link href="/" target="_blank">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-blue-200 border-blue-500/30 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors gap-2"
              >
                <ExternalLink className="h-3.5 w-3.5 text-primary" />
                Lihat Situs Utama
              </Button>
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
