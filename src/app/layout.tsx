
'use client';
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Chatbot } from '@/components/chatbot';
import { AuthProvider } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';

// Hapus metadata dari sini karena akan dikelola di komponen
// export const metadata: Metadata = {
//   title: 'Seido | PT. Seido Mitra Abadi',
//   description: 'Solusi Manufaktur & Engineering: Jasa Bubut CNC, Molding, dan Fabrikasi Conveyor.',
//   icons: {
//     icon: '/seidoiconnobg2.png',
//   },
// };

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      {children}
      <Toaster />
      {!isAdminPage && <Chatbot />}
    </>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Seido | PT. Seido Mitra Abadi</title>
        <meta name="description" content="Solusi Manufaktur & Engineering: Jasa Bubut CNC, Molding, dan Fabrikasi Conveyor." />
        <link rel="icon" href="/seidoicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
