'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Post, createPost, updatePost, getPostById } from '@/lib/blog';
import { getRandomSuggestions, type ArticleSuggestion } from '@/lib/blogSuggestions';
import { generateExcerpt, generateContent } from '@/lib/aiSuggestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '../components/RichTextEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { slugify } from '@/lib/utils';
import { toast } from 'sonner';

export default function BlogPostEditor() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.postId as string;
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [suggestions, setSuggestions] = useState<ArticleSuggestion[]>(getRandomSuggestions());
  const [post, setPost] = useState<Partial<Post>>({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft',
    author: '',
  });

  useEffect(() => {
    if (postId && postId !== 'new') {
      const fetchPost = async () => {
        try {
          const fetchedPost = await getPostById(postId);
          setPost(fetchedPost);
        } catch (error) {
          console.error('Error fetching post:', error);
          toast.error('Gagal memuat artikel');
          router.push('/admin/blog');
        }
      };
      fetchPost();
    }
  }, [postId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalPost = {
        ...post,
        slug: slugify(post.title || ''),
        published_at: post.status === 'published' ? new Date().toISOString() : null,
      };

      if (postId && postId !== 'new') {
        await updatePost(postId, finalPost);
        toast.success('Artikel berhasil diperbarui');
      } else {
        await createPost(finalPost as Omit<Post, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Artikel berhasil dibuat');
      }
      router.refresh(); // Refresh the page to show updated data

      router.push('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Gagal menyimpan artikel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">
        {postId && postId !== 'new' ? 'Edit Artikel' : 'Buat Artikel Baru'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informasi Dasar */}
        <div className="space-y-6 rounded-lg border p-4">
          <h2 className="font-semibold">Informasi Dasar</h2>
          
          <div className="space-y-3">
            <Label htmlFor="title">Judul Artikel</Label>
            <Input
              id="title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              required
              placeholder="Masukkan judul artikel"
              className="mt-1.5"
            />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">✨ Inspirasi Judul:</p>
                <div className="h-px flex-1 bg-gray-200"></div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setSuggestions(getRandomSuggestions())}
                >
                  🎲 Ganti Saran
                </Button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPost({ ...post, title: suggestion.title })}
                    className="group flex items-start gap-2 rounded-lg border border-gray-200 p-2 text-left transition-all hover:border-blue-500 hover:bg-blue-50"
                  >
                    <span className="mt-0.5 text-lg">{suggestion.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                        {suggestion.title}
                      </p>
                      <span className="text-xs text-gray-500">{suggestion.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="excerpt">Ringkasan Singkat</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                disabled={!post.title || loadingAI}
                onClick={async () => {
                  try {
                    setLoadingAI(true);
                    const suggestion = await generateExcerpt(post.title || '');
                    setPost({ ...post, excerpt: suggestion });
                    toast.success('Ringkasan berhasil dibuat!');
                  } catch (error) {
                    toast.error('Gagal membuat ringkasan');
                  } finally {
                    setLoadingAI(false);
                  }
                }}
              >
                {loadingAI ? '⏳' : '🤖'} Buat Ringkasan AI
              </Button>
            </div>
            <Textarea
              id="excerpt"
              value={post.excerpt}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              rows={2}
              placeholder="Ringkasan pendek untuk halaman daftar artikel (maks. 160 karakter)"
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Konten Artikel */}
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Konten Artikel</h2>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                disabled={!post.title || !post.excerpt || loadingAI}
                onClick={async () => {
                  try {
                    setLoadingAI(true);
                    const suggestion = await generateContent(post.title || '', post.excerpt || '');
                    setPost({ ...post, content: suggestion });
                    toast.success('Konten berhasil dibuat!');
                  } catch (error) {
                    toast.error('Gagal membuat konten');
                  } finally {
                    setLoadingAI(false);
                  }
                }}
              >
                {loadingAI ? '⏳' : '🤖'} Buat Konten AI
              </Button>
            </div>
            
            <RichTextEditor
              content={post.content || ''}
              onChange={(content) => setPost({ ...post, content })}
            />
          </div>        {/* Gambar & Detail */}
        <div className="grid gap-6 rounded-lg border p-4 md:grid-cols-2">
          <div>
            <Label htmlFor="featured_image">Gambar Utama</Label>
            <div className="mt-1.5 space-y-2">
              <div className="flex gap-2">
                <Input
                  id="featured_image"
                  type="url"
                  value={post.featured_image}
                  onChange={(e) => setPost({ ...post, featured_image: e.target.value })}
                  placeholder="URL gambar"
                />
                <Input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    try {
                      setLoading(true)
                      
                      // Client-side validation
                      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
                      if (!allowedTypes.includes(file.type)) {
                        toast.error('Tipe file tidak valid. Hanya gambar JPEG, PNG, WebP dan GIF yang diizinkan.')
                        return
                      }

                      const maxSize = 5 * 1024 * 1024 // 5MB
                      if (file.size > maxSize) {
                        toast.error('Ukuran file terlalu besar. Maksimum 5MB.')
                        return
                      }

                      const formData = new FormData()
                      formData.append('file', file)

                      const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                      })

                      const data = await response.json()
                      
                      if (!response.ok) {
                        throw new Error(data.error || 'Upload failed')
                      }

                      setPost({ ...post, featured_image: data.url })
                      toast.success('Gambar berhasil diunggah')
                    } catch (error: any) {
                      console.error('Error uploading image:', error)
                      toast.error(error.message || 'Gagal mengunggah gambar')
                    } finally {
                      setLoading(false)
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={loading}
                >
                  {loading ? 'Mengunggah...' : 'Unggah Gambar'}
                </Button>
              </div>
              {post.featured_image && (
                <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-50">
                  <img
                    src={post.featured_image}
                    alt="Featured image preview"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      toast.error('Gagal memuat gambar preview');
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5" /> {/* Subtle overlay */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute right-2 top-2 opacity-90 hover:opacity-100"
                    onClick={() => setPost({ ...post, featured_image: '' })}
                  >
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="author">Penulis</Label>
              <Input
                id="author"
                value={post.author}
                onChange={(e) => setPost({ ...post, author: e.target.value })}
                required
                placeholder="Nama penulis"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="status">Status Artikel</Label>
              <Select
                value={post.status}
                onValueChange={(value) =>
                  setPost({ ...post, status: value as 'draft' | 'published' })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Terbit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Menyimpan...' : postId && postId !== 'new' ? 'Perbarui Artikel' : 'Buat Artikel'}
          </Button>
        </div>
      </form>
    </div>
  );
}
