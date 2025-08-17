
'use client';
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "../components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner";
import { Chatbot } from '../components/chatbot';
import { AuthProvider } from '../hooks/use-auth';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { recordPageView } from '../lib/page-views';

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

  useEffect(() => {
    // Only record for non-admin pages
    if (!isAdminPage) {
      recordPageView(window.location.pathname);
    }
  }, [pathname, isAdminPage]);

  return (
    <>
      {children}
      <Toaster />
      <SonnerToaster position="top-center" richColors closeButton />
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
        <title>Seido | PT. Seido Mitra Abadi - Jasa Bubut CNC, Molding & Fabrikasi Conveyor</title>
        <meta name="description" content="PT. Seido Mitra Abadi menyediakan solusi manufaktur & engineering terbaik: Jasa Bubut CNC, Molding, dan Fabrikasi Conveyor untuk industri di Indonesia. Berlokasi di Tangerang dengan pengalaman lebih dari 10 tahun." />
        <meta name="keywords" content="bubut cnc, molding, fabrikasi conveyor, manufaktur, engineering, jasa bubut, jasa molding, conveyor industri, PT Seido Mitra Abadi, seido, tangerang" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="PT. Seido Mitra Abadi" />
        <meta name="language" content="id" />
        <meta name="geo.region" content="ID-BT" />
        <meta name="geo.placename" content="Tangerang" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://seido.co.id/" />
        <meta property="og:title" content="Seido | PT. Seido Mitra Abadi - Solusi Manufaktur & Engineering" />
        <meta property="og:description" content="Solusi Manufaktur & Engineering terpercaya: Jasa Bubut CNC, Molding, dan Fabrikasi Conveyor untuk kebutuhan industri Anda." />
        <meta property="og:image" content="/seidoiconnobg2.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://seido.co.id/" />
        <meta property="twitter:title" content="Seido | PT. Seido Mitra Abadi - Solusi Manufaktur & Engineering" />
        <meta property="twitter:description" content="Solusi Manufaktur & Engineering terpercaya: Jasa Bubut CNC, Molding, dan Fabrikasi Conveyor untuk kebutuhan industri Anda." />
        <meta property="twitter:image" content="/seidoiconnobg2.png" />
        
        {/* Favicon */}
        <link rel="icon" href="/seidoicon.png" />
        <link rel="apple-touch-icon" href="/seidoicon.png" />
        <link rel="canonical" href="https://seido.co.id/" />
        <link rel="manifest" href="/manifest.json" />
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
