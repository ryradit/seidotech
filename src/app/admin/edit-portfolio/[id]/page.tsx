'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, X, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrls: string[];
  aiHint?: string;
}

const categories = [
  'Conveyor System',
  'Industrial Equipment',
  'Manufacturing',
  'Automation',
  'Custom Fabrication',
  'Maintenance Service',
  'Engineering Solution'
];

export default function EditPortfolioPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    aiHint: ''
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Fetch existing project data
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        
        setProject(data);
        setFormData({
          title: data.title || '',
          category: data.category || '',
          description: data.description || '',
          aiHint: data.aiHint || ''
        });
        setExistingImages(data.imageUrls || []);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          variant: 'destructive',
          title: 'Gagal memuat proyek',
          description: 'Proyek tidak ditemukan atau terjadi kesalahan.',
        });
        router.push('/admin/portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, router, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + existingImages.length + newImages.length > 10) {
      toast({
        variant: 'destructive',
        title: 'Terlalu banyak gambar',
        description: 'Maksimal 10 gambar per proyek.',
      });
      return;
    }
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages(prev => prev.filter(url => url !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of newImages) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('portfolios')
        .upload(filePath, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('portfolios')
        .getPublicUrl(filePath);

      uploadedUrls.push(urlData.publicUrl);
    }
    
    return uploadedUrls;
  };

  const deleteImages = async () => {
    for (const imageUrl of imagesToDelete) {
      try {
        const path = imageUrl.split('/storage/v1/object/public/portfolios/')[1];
        if (path) {
          await supabase.storage.from('portfolios').remove([path]);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.category || !formData.description.trim()) {
      toast({
        variant: 'destructive',
        title: 'Form tidak lengkap',
        description: 'Mohon isi semua field yang wajib.',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Upload new images
      const newImageUrls = await uploadImages();
      
      // Delete marked images
      await deleteImages();
      
      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...newImageUrls];

      // Update project in database
      const { error } = await supabase
        .from('portfolios')
        .update({
          title: formData.title.trim(),
          category: formData.category,
          description: formData.description.trim(),
          aiHint: formData.aiHint.trim() || null,
          imageUrls: allImageUrls,
          updatedAt: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: 'Sukses',
        description: 'Proyek berhasil diperbarui.',
      });
      
      router.push('/admin/portfolio');
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal memperbarui proyek',
        description: 'Terjadi kesalahan saat menyimpan data.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 p-4 md:p-6 lg:p-8 flex justify-center items-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Proyek tidak ditemukan.</p>
          <Link href="/admin/portfolio" className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
              Edit Proyek
            </h1>
            <p className="text-muted-foreground mt-2">
              Perbarui informasi proyek portofolio
            </p>
          </div>
          <Link href="/admin/portfolio">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>
                Informasi utama tentang proyek portofolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Proyek *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Masukkan judul proyek"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Masukkan deskripsi proyek"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiHint">AI Hint (Opsional)</Label>
                <Input
                  id="aiHint"
                  value={formData.aiHint}
                  onChange={(e) => handleInputChange('aiHint', e.target.value)}
                  placeholder="Hint untuk AI tentang proyek ini"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Proyek</CardTitle>
              <CardDescription>
                Upload gambar untuk menampilkan proyek Anda (maksimal 10 gambar)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Gambar Saat Ini</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square relative overflow-hidden rounded-lg border">
                          <Image
                            src={imageUrl}
                            alt={`Existing image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExistingImage(imageUrl)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {newImages.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Gambar Baru</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
                    {newImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square relative overflow-hidden rounded-lg border">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`New image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeNewImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <div>
                <Label htmlFor="images" className="cursor-pointer">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Klik untuk menambah gambar baru atau drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Format: JPG, PNG, WebP (maksimal 5MB per file)
                    </p>
                  </div>
                </Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/portfolio">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
