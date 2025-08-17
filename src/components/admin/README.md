# Admin Navbar Component

A modular and customizable admin navigation sidebar for the Seido admin dashboard.

## 📁 File Structure

```
src/components/admin/
├── admin-navbar.tsx      # Main navbar component
├── use-admin-navbar.ts   # Hook for navbar state management
├── navbar-config.ts      # Configuration and types
├── index.ts             # Export file
└── README.md            # This documentation
```

## 🚀 Usage

### Basic Usage

```tsx
import { AdminNavbar } from '@/components/admin';

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AdminNavbar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### With Custom Hook

```tsx
import { useAdminNavbar } from '@/components/admin';

function MyComponent() {
  const { navItems, updateBadgeCounts } = useAdminNavbar();
  
  // Update message count
  updateBadgeCounts('messages', 5);
}
```

## 🎨 Customization

### Adding New Navigation Items

1. **Update the hook** (`use-admin-navbar.ts`):

```tsx
const mainNavItems = [
  // ... existing items
  {
    title: 'New Section',
    href: '/admin/new-section',
    isActive: isActive('/admin/new-section'),
    badge: null
  }
];
```

2. **Add icon mapping** (`admin-navbar.tsx`):

```tsx
import { NewIcon } from 'lucide-react';

const iconMap = {
  // ... existing icons
  NewIcon
};
```

### Customizing Styles

The navbar uses Tailwind CSS classes and can be customized by:

1. **Modifying the component directly**
2. **Using className prop**
3. **Updating the CSS variables in your theme**

### Dynamic Badge Updates

```tsx
// In any component
import { useAdminNavbar } from '@/components/admin';

function SomeComponent() {
  const { updateBadgeCounts } = useAdminNavbar();
  
  // Update message count
  useEffect(() => {
    // Fetch from API
    fetchMessages().then(messages => {
      updateBadgeCounts('messages', messages.unread.length);
    });
  }, []);
}
```

## 🔧 Configuration Options

### Navigation Structure

The navbar is organized into three main sections:

1. **Main Menu** - Primary navigation (Dashboard, Portfolio, etc.)
2. **Management** - Administrative tools (Analytics, Users, Reports)
3. **System** - System settings and help

### Features

- ✅ **Dynamic badge counts** for notifications and messages
- ✅ **Active state management** based on current route
- ✅ **Responsive design** with mobile support
- ✅ **User profile section** with logout functionality
- ✅ **Glassmorphism effects** and modern styling
- ✅ **Icon mapping** for easy customization
- ✅ **TypeScript support** with proper types

## 📱 Responsive Behavior

- **Desktop**: Full sidebar visible
- **Mobile**: Collapsible sidebar with trigger button
- **Tablet**: Adaptive based on screen size

## 🎯 Key Components

### AdminNavbar
Main component that renders the complete sidebar navigation.

### useAdminNavbar
Hook that manages navigation state, active routes, and badge counts.

### navbar-config
Configuration file with default navigation structure and types.

## 🔄 State Management

The navbar automatically:
- Tracks current route and highlights active items
- Manages badge counts for notifications/messages
- Handles user authentication state
- Provides logout functionality

## 🚨 Adding New Sections

To add a completely new section:

1. **Add to hook**:
```tsx
const newSectionItems = [
  {
    title: 'New Item',
    href: '/admin/new-item',
    isActive: isActive('/admin/new-item'),
    badge: null
  }
];

return {
  main: mainNavItems,
  management: managementNavItems,
  system: systemNavItems,
  newSection: newSectionItems // Add here
};
```

2. **Update component**:
```tsx
{renderNavSection('New Section', navItems.newSection)}
```

## 🎨 Theming

The navbar respects your app's theme configuration and uses:
- CSS variables for colors
- Tailwind utility classes
- Custom backdrop blur effects
- Smooth transitions and animations

## 📞 Support

For questions or customization help, refer to the main project documentation or modify the files directly as needed.
