'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MessageSquare, ArrowRight, Briefcase, Handshake, Users } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTotalPageViews } from '@/lib/page-views';

export default function AdminDashboard() {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [mitraCount, setMitraCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch unread messages count
        const { count: unreadCount, error: unreadError } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'unread');
          
        if (unreadError) throw unreadError;
        
        // Fetch recent messages
        const { data: recentData, error: recentError } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentError) throw recentError;
        
        // Fetch portfolio count
        const { count: portfolioCount, error: portfolioError } = await supabase
          .from('portfolios')
          .select('*', { count: 'exact', head: true });
        
        if (portfolioError) throw portfolioError;
        
        // Fetch mitra count
        const { count: mitraCount, error: mitraError } = await supabase
          .from('mitras')
          .select('*', { count: 'exact', head: true });
          
        if (mitraError) throw mitraError;
        
        // Get total messages count for the message card
        const { count: totalMessages, error: totalMessagesError } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true });
          
        if (totalMessagesError) throw totalMessagesError;

        // Get total visitor count
        const totalVisitors = await getTotalPageViews();
        
        setUnreadMessages(unreadCount || 0);
        setRecentMessages(recentData || []);
        setPortfolioCount(portfolioCount || 0);
        setMitraCount(mitraCount || 0);
        setVisitorCount(totalVisitors);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Subscribe to realtime updates for messages
    const messagesSubscription = supabase
      .channel('contact_messages_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contact_messages' }, 
        () => fetchDashboardData()
      )
      .subscribe();
    
    // Subscribe to realtime updates for portfolios
    const portfoliosSubscription = supabase
      .channel('portfolios_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'portfolios' }, 
        () => fetchDashboardData()
      )
      .subscribe();
      
    // Subscribe to realtime updates for mitras
    const mitrasSubscription = supabase
      .channel('mitras_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'mitras' }, 
        () => fetchDashboardData()
      )
      .subscribe();
    
    return () => {
      messagesSubscription.unsubscribe();
      portfoliosSubscription.unsubscribe();
      mitrasSubscription.unsubscribe();
    };
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Generate time-based greeting
  useEffect(() => {
    const generateGreeting = () => {
      const currentHour = new Date().getHours();
      
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting("Selamat Pagi");
      } else if (currentHour >= 12 && currentHour < 15) {
        setGreeting("Selamat Siang");
      } else if (currentHour >= 15 && currentHour < 19) {
        setGreeting("Selamat Sore");
      } else {
        setGreeting("Selamat Malam");
      }
    };
    
    generateGreeting();
    
    // Update greeting every hour
    const intervalId = setInterval(generateGreeting, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-b from-background to-slate-50/20 dark:from-background dark:to-slate-900/10">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              {greeting}, Admin
            </h1>
            <p className="text-muted-foreground">
              Kelola konten situs web Anda dari sini.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-muted/40 p-2 rounded-md">
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <section>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Portfolio Stats */}
            <Card className="border border-border/40 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Portfolio</CardTitle>
                <Briefcase className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
                ) : (
                  <div className="text-3xl font-bold">{portfolioCount}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Total portfolio yang telah dibuat
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/admin/portfolio" className="flex items-center justify-center">
                      <span className="mr-1">Kelola Portfolio</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Mitra Stats */}
            <Card className="border border-border/40 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Mitra</CardTitle>
                <Handshake className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
                ) : (
                  <div className="text-3xl font-bold">{mitraCount}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Total mitra yang telah terdaftar
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/admin/mitra" className="flex items-center justify-center">
                      <span className="mr-1">Kelola Mitra</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Messages Stats */}
            <Card className="border border-border/40 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Pesan</CardTitle>
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
                ) : (
                  <div className="text-3xl font-bold">{unreadMessages}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Jumlah pesan yang belum dibaca
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/admin/pesan-masuk" className="flex items-center justify-center">
                      <span className="mr-1">Kelola Pesan</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Visitor Stats */}
            <Card className="border border-border/40 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Pengunjung</CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
                ) : (
                  <div className="text-3xl font-bold">{visitorCount}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Total kunjungan website
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Recent Messages */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Pesan Terbaru</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/pesan-masuk" className="flex items-center">
                <span className="mr-1">Lihat Semua</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <Card className="border border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Kotak Masuk</CardTitle>
                <Badge className="px-3 py-1 flex items-center gap-1 bg-blue-500/10 text-blue-500">
                  <MessageSquare className="h-3 w-3" />
                  <span>{unreadMessages} belum dibaca</span>
                </Badge>
              </div>
              <CardDescription>
                Pesan terbaru dari pengunjung website
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : recentMessages.length > 0 ? (
                <div className="space-y-3">
                  {recentMessages.map((message) => (
                    <Link 
                      href={`/admin/pesan-masuk?messageId=${message.id}`}
                      key={message.id}
                      className="block p-4 border border-border/60 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{message.name}</h4>
                        <Badge variant={message.status === 'unread' ? 'secondary' : 'outline'}>
                          {message.status === 'unread' ? 'Belum dibaca' : 'Dibaca'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {formatDate(message.created_at)}
                      </div>
                      <p className="text-sm line-clamp-2">{message.message}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p>Tidak ada pesan terbaru</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}