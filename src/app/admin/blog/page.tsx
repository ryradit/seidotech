'use client';

import { useState, useEffect } from 'react';
import { Post, getAllPosts, deletePost } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { PenIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const fetchPosts = async () => {
    try {
      const posts = await getAllPosts();
      setPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await deletePost(postToDelete.id);
      toast.success('Artikel berhasil dihapus');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Gagal menghapus artikel');
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Kelola Blog</h1>
          <p className="text-muted-foreground">
            Kelola dan publikasikan artikel untuk website Seido
          </p>
        </div>
        <Button asChild size="lg" className="shadow-sm">
          <Link href="/admin/blog/new">
            <PlusIcon className="h-5 w-5 mr-2" />
            Tambah Artikel
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Total Artikel</p>
          <p className="text-3xl font-bold">{posts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Artikel Terbit</p>
          <p className="text-3xl font-bold">{posts.filter(p => p.status === 'published').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Artikel Draft</p>
          <p className="text-3xl font-bold">{posts.filter(p => p.status === 'draft').length}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Daftar Artikel</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Tanggal Terbit</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <PenIcon className="h-8 w-8 mb-2 stroke-1" />
                    <p>Belum ada artikel. Mulai menulis artikel pertamamu!</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-100'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-100'
                      }`}
                    >
                      {post.status === 'published' ? '• Terbit' : '◦ Draft'}
                    </span>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    {post.published_at
                      ? formatDate(post.published_at)
                      : 'Belum terbit'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8"
                      >
                        <Link href={`/admin/blog/${post.id}`}>
                          <PenIcon className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(post)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus artikel secara permanen dan tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}