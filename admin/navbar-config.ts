export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: string | number | null;
  children?: NavItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const defaultNavConfig = {
  main: [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: 'Home',
      badge: null
    },
    {
      title: 'Portfolio',
      href: '/admin/portfolio',
      icon: 'Briefcase',
      badge: null
    },
    {
      title: 'Mitra',
      href: '/admin/mitra',
      icon: 'Handshake',
      badge: null
    },
    {
      title: 'Pesan Masuk',
      href: '/admin/pesan-masuk',
      icon: 'MessageSquare',
      badge: null
    }
  ],
  management: [
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: 'BarChart3',
      badge: null
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: 'Users',
      badge: null
    },
    {
      title: 'Reports',
      href: '/admin/reports',
      icon: 'FileText',
      badge: null
    }
  ],
  system: [
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: 'Settings',
      badge: null
    },
    {
      title: 'Notifications',
      href: '/admin/notifications',
      icon: 'Bell',
      badge: null
    },
    {
      title: 'Help',
      href: '/admin/help',
      icon: 'HelpCircle',
      badge: null
    }
  ]
};

export const navbarConfig = {
  title: 'Seido Admin',
  subtitle: 'Dashboard',
  logo: '/seidoiconnobg2.png',
  showBadges: true,
  showGroupLabels: true,
  collapsible: true
};
