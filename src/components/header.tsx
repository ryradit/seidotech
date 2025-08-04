
'use client';

import Link from 'next/link';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Shield, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/30 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image src="/seidoicon.png" alt="Seido Logo" width={128} height={128} className="h-10 w-15" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
           <Link href="/" className="text-muted-foreground transition-colors hover:text-primary" prefetch={false}>
            Halaman Utama
          </Link>
          <Link href="/tentang-kami" className="text-muted-foreground transition-colors hover:text-primary" prefetch={false}>
            Tentang Kami
          </Link>
          <Link href="/layanan" className="text-muted-foreground transition-colors hover:text-primary" prefetch={false}>
            Layanan
          </Link>
          <Link href="/portfolio" className="text-muted-foreground transition-colors hover:text-primary" prefetch={false}>
            Portofolio
          </Link>
           <Link href="/kontak" className="text-muted-foreground transition-colors hover:text-primary" prefetch={false}>
            Kontak
          </Link>
           {user && (
             <Link href="/admin" className="text-muted-foreground transition-colors hover:text-primary" prefetch={false}>
                Dasbor
              </Link>
           )}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
             <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout" className="hidden sm:flex">
                <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Link href="/admin/login" prefetch={false} className="hidden sm:block">
              <Button variant="ghost" size="icon" aria-label="Admin Login">
                  <Shield className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <Link href="/kontak" prefetch={false} className="hidden sm:block">
            <Button>Hubungi Kami</Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 p-4">
                <Link href="/" className="flex items-center gap-2 mb-4" prefetch={false}>
                   <Image src="/seidoiconnobg2.png" alt="Seido Logo" width={50} height={50} className="h-12 w-12" />
                </Link>
                <nav className="grid gap-2 text-base font-medium">
                    <Link href="/tentang-kami" className="block rounded-lg px-3 py-2 hover:bg-accent" prefetch={false}>Tentang Kami</Link>
                    <Link href="/layanan" className="block rounded-lg px-3 py-2 hover:bg-accent" prefetch={false}>Layanan</Link>
                    <Link href="/portfolio" className="block rounded-lg px-3 py-2 hover:bg-accent" prefetch={false}>Portofolio</Link>
                    <Link href="/kontak" className="block rounded-lg px-3 py-2 hover:bg-accent" prefetch={false}>Kontak</Link>
                    {user ? (
                       <>
                        <Link href="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent" prefetch={false}>
                            <Shield className="h-5 w-5" />
                            Dasbor
                        </Link>
                        <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 justify-start rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent">
                            <LogOut className="h-5 w-5" />
                            Logout
                        </Button>
                       </>
                    ) : (
                        <Link href="/admin/login" className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent" prefetch={false}>
                            <Shield className="h-5 w-5" />
                            Admin
                        </Link>
                    )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
