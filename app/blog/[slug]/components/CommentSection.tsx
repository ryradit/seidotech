'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/components/ui/use-toast';
import { formatDistance } from 'date-fns';
import { id } from 'date-fns/locale';

interface Comment {
  id: string;
  created_at: string;
  content: string;
  post_slug: string;
  author_name: string;
  author_email: string;
}

export default function CommentSection({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    content: ''
  });
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_slug', postSlug)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(data);
    }
  };

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!form.name || !form.email || !form.content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Mohon isi semua kolom yang diperlukan.",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('comments')
      .insert([
        {
          post_slug: postSlug,
          author_name: form.name,
          author_email: form.email,
          content: form.content
        }
      ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan komentar. Silakan coba lagi.",
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Komentar Anda telah ditambahkan.",
      });
      setForm({ name: '', email: '', content: '' });
      fetchComments();
    }

    setIsLoading(false);
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Komentar</h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-12">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nama
            </label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Masukkan nama Anda"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Masukkan email Anda"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Komentar
          </label>
          <Textarea
            id="comment"
            value={form.content}
            onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Tulis komentar Anda di sini"
            rows={4}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Mengirim...' : 'Kirim Komentar'}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Belum ada komentar. Jadilah yang pertama berkomentar!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{comment.author_name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDistance(new Date(comment.created_at), new Date(), {
                    addSuffix: true,
                    locale: id
                  })}
                </div>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
