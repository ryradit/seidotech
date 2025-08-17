
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Trash2, PlusCircle, Pencil } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrls: string[];
  aiHint?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ManagePortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .order('createdAt', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects: ', error);
      toast({
        variant: 'destructive',
        title: 'Gagal memuat proyek',
        description: 'Terjadi kesalahan saat mengambil data dari server.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (projectId: string, imageUrls: string[]) => {
    setDeletingId(projectId);
    try {
      // Delete images from Supabase Storage
      if (imageUrls && imageUrls.length > 0) {
        for (const url of imageUrls) {
          // Extract the path after the bucket name
          const path = url.split('/storage/v1/object/public/portfolios/')[1];
          if (path) {
            const { error: storageError } = await supabase.storage.from('portfolios').remove([path]);
            if (storageError) throw storageError;
          }
        }
      }

      // Delete row from Supabase
      const { error: deleteError } = await supabase.from('portfolios').delete().eq('id', projectId);
      if (deleteError) throw deleteError;

      toast({
        title: 'Sukses',
        description: 'Proyek berhasil dihapus.',
      });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project: ', error);
      toast({
        variant: 'destructive',
        title: 'Gagal menghapus proyek',
        description: 'Terjadi kesalahan saat menghapus data.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 p-4 md:p-6 lg:p-8 flex justify-center items-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </main>
    );
  }
  
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Kelola Portofolio
            </h1>
            <Link href="/admin/add-portfolio">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Baru
                </Button>
            </Link>
        </div>

        {projects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
                <Card key={project.id} className="flex flex-col">
                <CardHeader>
                    <CardTitle className="truncate">{project.title}</CardTitle>
                    <Badge variant="secondary" className="w-fit">{project.category}</Badge>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                   <div className="relative aspect-video w-full overflow-hidden rounded-md">
                     <Image
                        src={project.imageUrls?.[0] || 'https://placehold.co/600x400.png'}
                        alt={project.title}
                        fill
                        className="object-cover"
                     />
                   </div>
                   <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Link href={`/admin/edit-portfolio/${project.id}`}>
                        <Button variant="outline" size="sm">
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Button>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={deletingId === project.id}>
                                {deletingId === project.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                Hapus
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus proyek secara permanen dari server.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(project.id, project.imageUrls)}>
                                Yakin, Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
                </Card>
            ))}
            </div>
        ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Belum ada proyek portofolio.</p>
                <Link href="/admin/add-portfolio" className="mt-4 inline-block">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambahkan Proyek Pertama Anda
                    </Button>
                </Link>
            </div>
        )}
    </main>
  );
}