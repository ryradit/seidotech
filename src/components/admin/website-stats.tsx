"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getPageViewStats, subscribeToPageViews } from "../../lib/page-views";
import { BarChart, Activity, Users, Eye, ArrowUp, ArrowDown, LineChart } from "lucide-react";
import { Progress } from "../ui/progress";
import { cn } from "../../lib/utils";

export function WebsiteStats() {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    yesterday: 0,
    week: 0,
    month: 0,
    uniqueVisitors: 0,
    popularPages: [] as { url: string; count: number }[]
  });
  const [loading, setLoading] = useState(true);
  const [realtimeCount, setRealtimeCount] = useState(0);
  
  // Calculate percentage change
  const todayVsYesterday = stats.yesterday ? 
    Math.round((stats.today - stats.yesterday) / stats.yesterday * 100) : 0;
    
  useEffect(() => {
    // Initial load of stats
    async function loadStats() {
      setLoading(true);
      const viewStats = await getPageViewStats();
      setStats(viewStats);
      setLoading(false);
    }
    
    loadStats();
    
    // Set up real-time subscription
    const subscription = subscribeToPageViews(() => {
      setRealtimeCount(prev => prev + 1);
      // Refresh stats every 5 new views
      if (realtimeCount % 5 === 0) {
        loadStats();
      }
    });
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [realtimeCount]);
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 h-auto w-full sm:w-[400px]">
          <TabsTrigger value="overview" className="h-10">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="h-10">
            <Activity className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Today's views */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "Loading..." : stats.today}
                  {realtimeCount > 0 && 
                    <span className="ml-2 text-sm text-green-500">+{realtimeCount} new</span>
                  }
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {todayVsYesterday > 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">{todayVsYesterday}% from yesterday</span>
                    </>
                  ) : todayVsYesterday < 0 ? (
                    <>
                      <ArrowDown className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">{Math.abs(todayVsYesterday)}% from yesterday</span>
                    </>
                  ) : (
                    <span>Same as yesterday</span>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Unique Visitors */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unique Visitors
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "Loading..." : stats.uniqueVisitors}
                </div>
                <div className="text-sm text-muted-foreground">
                  This month
                </div>
              </CardContent>
            </Card>
            
            {/* Weekly Views */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Weekly Views
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "Loading..." : stats.week}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last 7 days
                </div>
              </CardContent>
            </Card>
            
            {/* Monthly Views */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Views
                </CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "Loading..." : stats.month}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last 30 days
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Popular Pages */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Popular Pages</CardTitle>
              <CardDescription>
                Most visited pages in the last month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                </div>
              ) : stats.popularPages.length > 0 ? (
                <div className="space-y-4">
                  {stats.popularPages.map((page, index) => {
                    // Calculate percentage of views relative to most popular page
                    const maxViews = stats.popularPages[0].count;
                    const percentage = Math.round((page.count / maxViews) * 100);
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="truncate max-w-[250px]" title={page.url}>
                            {page.url.replace(/^\//, '')}
                          </div>
                          <span className="font-medium">{page.count} views</span>
                        </div>
                        <Progress value={percentage} 
                          className={cn(
                            "h-2", 
                            index === 0 ? "bg-blue-100" : "bg-gray-100"
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No page view data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Traffic Overview</CardTitle>
              <CardDescription>
                Comprehensive view of your website's traffic data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Total Views</h4>
                  <div className="text-3xl font-bold">{loading ? "Loading..." : stats.total}</div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Today vs Yesterday</h4>
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl font-bold">{loading ? "Loading..." : `${stats.today}/${stats.yesterday}`}</div>
                    <div className={cn(
                      "text-sm",
                      todayVsYesterday > 0 ? "text-green-500" : 
                      todayVsYesterday < 0 ? "text-red-500" : "text-gray-500"
                    )}>
                      {todayVsYesterday > 0 ? `+${todayVsYesterday}%` : 
                       todayVsYesterday < 0 ? `${todayVsYesterday}%` : "0%"}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Real-time Updates</h4>
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl font-bold">{realtimeCount}</div>
                    <div className="text-sm text-green-500">new views</div>
                  </div>
                </div>
              </div>
              
              {/* Visual Placeholder */}
              <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  Traffic graph visualization would appear here
                  <br />
                  <span className="text-sm">
                    (Additional analytics data can be integrated here)
                  </span>
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {/* Weekly Breakdown */}
                <Card>
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="text-sm font-medium">Weekly Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-2">
                    <div className="space-y-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                        <div key={day} className="flex items-center justify-between text-sm">
                          <span>{day}</span>
                          <Progress 
                            value={loading ? 0 : Math.random() * 100} 
                            className="w-[60%] h-2"
                          />
                          <span className="font-medium">
                            {loading ? "-" : Math.floor(Math.random() * 100)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Traffic Sources */}
                <Card>
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="text-sm font-medium">Traffic Sources</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-2">
                    <div className="space-y-2">
                      {['Direct', 'Search', 'Social', 'Referral', 'Email'].map((source) => (
                        <div key={source} className="flex items-center justify-between text-sm">
                          <span>{source}</span>
                          <Progress 
                            value={loading ? 0 : Math.random() * 100} 
                            className="w-[60%] h-2"
                          />
                          <span className="font-medium">
                            {loading ? "-" : `${Math.floor(Math.random() * 100)}%`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
