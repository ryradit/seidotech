'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Clock, Mail, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  replies?: Reply[];
}

interface Reply {
  id: string;
  message_id: string;
  reply_text: string;
  created_at: string;
}

export default function PesanMasukPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Fetch messages
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*, replies(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Gagal memuat pesan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to realtime changes
    const subscription = supabase
      .channel('contact_messages_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contact_messages' }, 
        (payload) => {
          fetchMessages();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle message status update
  const updateMessageStatus = async (id: string, status: 'read' | 'replied') => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status } : msg
      ));
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error('Gagal mengubah status pesan');
    }
  };

  // Handle reply submission
  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) return;
    
    try {
      // Insert reply to database
      const { error: replyError } = await supabase
        .from('replies')
        .insert({
          message_id: messageId,
          reply_text: replyText,
          admin_email: user?.email || 'admin',
          created_at: new Date().toISOString()
        });

      if (replyError) throw replyError;
      
      // Update message status
      await updateMessageStatus(messageId, 'replied');
      
      // Send email with reply
      const message = messages.find(m => m.id === messageId);
      if (message) {
        // Use FormSubmit.co service to send email
        const formData = new FormData();
        formData.append('name', 'Admin Seido');
        formData.append('email', 'ptseido@gmail.com');
        formData.append('message', `${replyText}\n\n---\nBalasan untuk pesan Anda:\n${message.message}`);
        formData.append('_captcha', 'false');
        formData.append('_subject', `Re: ${message.subject}`);
        
        // Send to the original sender's email
        await fetch(`https://formsubmit.co/${message.email}`, {
          method: 'POST',
          body: formData
        });
      }
      
      // Reset state
      setReplyText("");
      setReplyingTo(null);
      
      // Refresh messages
      fetchMessages();
      
      toast.success('Balasan berhasil dikirim');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Gagal mengirim balasan');
    }
  };

  // Toggle message expansion
  const toggleMessageExpansion = (id: string) => {
    if (expandedMessage === id) {
      setExpandedMessage(null);
    } else {
      setExpandedMessage(id);
      // Mark as read if it's unread
      const message = messages.find(m => m.id === id);
      if (message && message.status === 'unread') {
        updateMessageStatus(id, 'read');
      }
    }
  };
  
  // Open detailed message dialog
  const openMessageDialog = (message: Message) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    // Mark as read if it's unread
    if (message.status === 'unread') {
      updateMessageStatus(message.id, 'read');
    }
  };
  
  // Filter messages based on active tab
  const filteredMessages = messages.filter(message => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return message.status === 'unread';
    if (activeTab === 'replied') return message.status === 'replied';
    return true;
  });
  
  // Get the count of unread messages
  const unreadCount = messages.filter(msg => msg.status === 'unread').length;

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <div className="relative mr-4">
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-primary to-primary/70 p-3 rounded-full text-background">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Pesan Masuk
            </h1>
            <p className="text-muted-foreground text-sm">
              {messages.length} pesan, {unreadCount} belum dibaca
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="ml-3">
              <Badge variant="destructive" className="animate-pulse">
                {unreadCount} baru
              </Badge>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <div className="bg-background border rounded-md flex items-center px-2 text-xs text-muted-foreground">
            Terakhir diperbarui: {messages.length > 0 ? formatDistanceToNow(new Date(), {addSuffix: true, locale: id}) : '-'}
          </div>
          <Button 
            variant="outline" 
            onClick={fetchMessages} 
            disabled={isLoading}
            className="bg-gradient-to-r from-background to-background hover:from-primary/5 hover:to-blue-500/5 transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 backdrop-blur-sm p-1 rounded-lg mb-6">
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full bg-transparent">
            <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Semua Pesan
              </span>
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
              <span className="flex items-center gap-2">
                <span className="relative">
                  <Mail className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-ping"></span>
                  )}
                </span>
                Belum Dibaca {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-primary text-background">{unreadCount}</Badge>
                )}
              </span>
            </TabsTrigger>
            <TabsTrigger value="replied" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Sudah Dibalas
              </span>
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <Card className="border-none shadow-lg bg-gradient-to-r from-background to-background/90 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-md rounded-full"></div>
                    <RefreshCw className="h-12 w-12 animate-spin text-primary relative" />
                  </div>
                  <p className="mt-4 text-muted-foreground animate-pulse">Memuat pesan...</p>
                </CardContent>
              </Card>
            ) : filteredMessages.length === 0 ? (
              <Card className="border-none shadow-lg bg-gradient-to-r from-background to-background/90 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-muted/30 blur-md rounded-full"></div>
                    <MessageSquare className="h-16 w-16 text-muted-foreground relative" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Tidak ada pesan</h3>
                  <p className="text-muted-foreground max-w-md">
                    {activeTab === 'unread' 
                      ? 'Semua pesan sudah dibaca.' 
                      : activeTab === 'replied' 
                      ? 'Belum ada pesan yang dibalas.' 
                      : 'Belum ada pesan yang masuk.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredMessages.map((message) => (
                  <Card 
                    key={message.id} 
                    className={`border group relative transition-all duration-300 
                      ${message.status === 'unread' 
                        ? 'bg-gradient-to-r from-primary/5 to-blue-500/5 shadow-lg border-l-4 border-l-primary' 
                        : 'hover:shadow-md hover:border-primary/30'}`
                    }
                  >
                    {message.status === 'unread' && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full transform translate-x-1 -translate-y-1 animate-pulse"></div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className={`h-10 w-10 ring-2 ring-offset-2 
                            ${message.status === 'unread' 
                              ? 'ring-primary/70 ring-offset-primary/10' 
                              : message.status === 'replied' 
                                ? 'ring-blue-500/70 ring-offset-blue-500/10' 
                                : 'ring-muted-foreground/20 ring-offset-background'}`
                          }>
                            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-blue-500/80 text-white font-medium text-lg">
                              {message.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base flex items-center gap-2 group-hover:text-primary transition-colors">
                              {message.name}
                              {message.status === 'unread' && (
                                <Badge variant="default" className="ml-2 bg-primary animate-pulse">Baru</Badge>
                              )}
                              {message.status === 'replied' && (
                                <Badge variant="outline" className="ml-2 border-blue-500/50 text-blue-500">Sudah Dibalas</Badge>
                              )}
                            </CardTitle>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground/70" />
                              <span className="hover:text-primary transition-colors">{message.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70" />
                          <time dateTime={message.created_at}>
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: id })}
                          </time>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="mb-2 font-medium text-primary/90 group-hover:text-primary transition-colors">
                        {message.subject}
                      </div>
                      <div 
                        className={`bg-muted/20 p-3 rounded-md border-l-2 
                          ${message.status === 'unread' ? 'border-primary' : 'border-muted'} 
                          transition-all duration-300 group-hover:border-primary`}
                      >
                        <p className={`text-muted-foreground ${expandedMessage !== message.id ? 'line-clamp-2' : ''}`}>
                          {message.message}
                        </p>
                      </div>
                      {message.message.length > 120 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 h-auto px-3 py-0.5 text-xs rounded-full bg-muted/20 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
                          onClick={() => toggleMessageExpansion(message.id)}
                        >
                          {expandedMessage === message.id ? (
                            <> 
                              <ChevronUp className="h-3 w-3 mr-1" /> 
                              Lebih sedikit
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              Baca selengkapnya
                            </>
                          )}
                        </Button>
                      )}
                      
                      {/* Show replies if any and if expanded */}
                      {expandedMessage === message.id && message.replies && message.replies.length > 0 && (
                        <div className="mt-4 pt-4 border-t space-y-3">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                            <span>Balasan:</span>
                          </h4>
                          {message.replies.map((reply) => (
                            <div key={reply.id} className="pl-3 border-l-2 border-blue-500 ml-4 bg-blue-500/5 p-3 rounded-md">
                              <p className="text-sm">{reply.reply_text}</p>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(reply.created_at), 'dd MMM yyyy, HH:mm')}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openMessageDialog(message)}
                          className="bg-gradient-to-r from-background to-background hover:from-primary/5 hover:to-blue-500/5 transition-all duration-300"
                        >
                          Lihat Detail
                        </Button>
                      </div>
                      <div>
                        {replyingTo === message.id ? (
                          <div className="flex w-full mt-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setReplyingTo(null)}
                              className="hover:bg-muted/30"
                            >
                              Batal
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="ml-2 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white"
                              onClick={() => handleReply(message.id)}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Kirim
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => setReplyingTo(message.id)}
                            className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Balas
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                    
                    {/* Reply textarea */}
                    {replyingTo === message.id && (
                      <div className="px-6 pb-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-md blur-sm"></div>
                          <Textarea
                            placeholder="Tulis balasan Anda..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                            className="resize-none relative bg-background/70 backdrop-blur-sm border-primary/20 focus:border-primary transition-all duration-300"
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Message Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-primary/20">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-primary">{selectedMessage.subject}</DialogTitle>
                <DialogDescription>
                  <div className="flex justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/70 ring-offset-2 ring-offset-background">
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-blue-500/80 text-white font-medium text-lg">
                          {selectedMessage.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-base">{selectedMessage.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-primary/70" />
                          {selectedMessage.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center bg-muted/20 px-3 py-1 rounded-full">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                      <time dateTime={selectedMessage.created_at}>
                        {format(new Date(selectedMessage.created_at), 'dd MMMM yyyy, HH:mm')}
                      </time>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-6 border p-4 rounded-md bg-muted/10 backdrop-blur-sm border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                <p className="whitespace-pre-line">{selectedMessage.message}</p>
              </div>
              
              {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    Balasan Sebelumnya:
                  </h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedMessage.replies.map((reply) => (
                      <div key={reply.id} className="border-l-2 border-blue-500 pl-4 py-2 bg-blue-500/5 rounded-md">
                        <p className="whitespace-pre-line">{reply.reply_text}</p>
                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-500/70" />
                          {format(new Date(reply.created_at), 'dd MMMM yyyy, HH:mm')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Separator className="my-4 bg-primary/10" />
              
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Send className="h-4 w-4 text-primary" />
                  Balas Pesan
                </h4>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-md blur-sm"></div>
                  <Textarea
                    placeholder="Tulis balasan Anda..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={5}
                    className="resize-none relative bg-background/70 backdrop-blur-sm border-primary/20 focus:border-primary transition-all duration-300"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-primary/20 hover:border-primary/50 transition-colors"
                >
                  Tutup
                </Button>
                <Button 
                  onClick={() => {
                    handleReply(selectedMessage.id);
                    setIsDialogOpen(false);
                  }}
                  disabled={!replyText.trim()}
                  className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white transition-all duration-300"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Kirim Balasan
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
