'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { NavItem } from './navbar-config';

export function useAdminNavbar() {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState(0);
  const [messages, setMessages] = useState(0);

  // Helper function to check if a route is active
  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  // Mock function to get notification counts
  const getNotificationCounts = async () => {
    // In a real app, you'd fetch this from your API
    // For now, we'll simulate some data
    setMessages(3);
    setNotifications(2);
  };

  useEffect(() => {
    getNotificationCounts();
  }, []);

  // Generate navigation items with current state
  const getNavItems = () => {
    const mainNavItems = [
      {
        title: 'Dashboard',
        href: '/admin',
        isActive: isActive('/admin'),
        badge: null
      },
      {
        title: 'Portfolio',
        href: '/admin/portfolio',
        isActive: isActive('/admin/portfolio') || isActive('/admin/add-portfolio'),
        badge: null
      },
      {
        title: 'Mitra',
        href: '/admin/mitra',
        isActive: isActive('/admin/mitra'),
        badge: null
      },
      {
        title: 'Pesan Masuk',
        href: '/admin/pesan-masuk',
        isActive: isActive('/admin/pesan-masuk'),
        badge: messages > 0 ? messages.toString() : null
      }
    ];

    const systemNavItems = [
      {
        title: 'Settings',
        href: '/admin/settings',
        isActive: isActive('/admin/settings'),
        badge: null
      },
      {
        title: 'Notifications',
        href: '/admin/notifications',
        isActive: isActive('/admin/notifications'),
        badge: notifications > 0 ? notifications.toString() : null
      },
      {
        title: 'Help',
        href: '/admin/help',
        isActive: isActive('/admin/help'),
        badge: null
      }
    ];

    return {
      main: mainNavItems,
      system: systemNavItems
    };
  };

  // Function to update badge counts
  const updateBadgeCounts = (type: 'messages' | 'notifications', count: number) => {
    if (type === 'messages') {
      setMessages(count);
    } else if (type === 'notifications') {
      setNotifications(count);
    }
  };

  return {
    navItems: getNavItems(),
    updateBadgeCounts,
    pathname,
    isActive
  };
}
