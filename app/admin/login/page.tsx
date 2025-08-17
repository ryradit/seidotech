
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      // Ensure we have a session
      if (!data?.session) {
        throw new Error('No session created');
      }

      // Set the auth cookie
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      });

      router.push('/admin');
      router.refresh(); // Refresh to update auth state
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: error.message || 'Email atau password salah.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary relative">
      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8">
        <Button variant="outline" size="sm" className="gap-2 text-foreground font-medium border-primary/50 hover:bg-primary/10 hover:text-primary hover:border-primary">
          <ArrowLeft className="h-4 w-4 text-primary" />
          Lihat Situs Utama
        </Button>
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <Image src="/seidoiconnobg2.png" alt="Seido Logo" width={100} height={100} className="mx-auto h-16 w-32" />
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Masuk ke dasbor untuk mengelola konten.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
