
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { generatePortfolioSuggestions } from '@/ai/flows/portfolio-suggestions-flow';

const portfolioSchema = z.object({
  title: z.string().min(1, 'Nama perusahaan diperlukan.'),
  category: z.string().min(1, 'Jenis jasa diperlukan.'),
  description: z.string().min(1, 'Deskripsi proyek diperlukan.'),
  images: z.instanceof(FileList).refine((files) => files.length > 0, 'Setidaknya satu gambar diperlukan.'),
  aiHint: z.string(),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

export function PortfolioForm() {
  const [loading, setLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      images: undefined,
      aiHint: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
      form.setValue('images', files);
    } else {
      setImagePreviews([]);
      const dataTransfer = new DataTransfer();
      form.setValue('images', dataTransfer.files);
    }
  };

  const handleGenerateSuggestions = async () => {
    const { title, category } = form.getValues();
    if (!title || !category) {
      toast({
        variant: 'destructive',
        title: 'Input Diperlukan',
        description: 'Harap isi Nama Perusahaan dan Jenis Jasa terlebih dahulu.',
      });
      return;
    }

    setLoadingAi(true);
    try {
      const suggestions = await generatePortfolioSuggestions({ title, category });
      form.setValue('description', suggestions.description);
      form.setValue('aiHint', suggestions.aiHint);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Gagal Menghasilkan Sugesti',
        description: 'Terjadi kesalahan saat berkomunikasi dengan AI.',
      });
    } finally {
      setLoadingAi(false);
    }
  };


  const onSubmit = async (data: PortfolioFormValues) => {
    setLoading(true);
    try {
      const imageUrls: string[] = [];
      for (const file of Array.from(data.images)) {
        const filePath = `portfolios/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from('portfolios').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('portfolios').getPublicUrl(filePath);
        imageUrls.push(publicUrlData.publicUrl);
      }

      const { error: insertError } = await supabase.from('portfolios').insert([
        {
          title: data.title,
          category: data.category,
          description: data.description,
          imageUrls,
          aiHint: data.aiHint || '',
          createdAt: new Date().toISOString(),
        },
      ]);
      if (insertError) throw insertError;

      toast({
        title: 'Sukses',
        description: 'Proyek portofolio berhasil ditambahkan.',
      });
      form.reset();
      setImagePreviews([]);
      router.push('/admin/portfolio');
    } catch (error: any) {
      console.error('Error submitting form: ', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menyimpan portofolio. Silakan coba lagi.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Perusahaan / Judul Proyek</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: PT. ABC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Jasa</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: CNC Machining" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <FormLabel>Deskripsi Proyek</FormLabel>
                 <Button type="button" size="sm" variant="ghost" onClick={handleGenerateSuggestions} disabled={loadingAi}>
                    {loadingAi ? (
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                       <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Dapatkan Sugesti AI
                 </Button>
            </div>
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem className="!mt-0">
                <FormLabel className="sr-only">Deskripsi Proyek</FormLabel>
                <FormControl>
                    <Textarea placeholder="Deskripsi Proyek: Pengerjaan komponen presisi untuk mesin industri..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="aiHint"
            render={({ field }) => (
                <FormItem>
                 <FormLabel>Petunjuk AI untuk Gambar (Opsional)</FormLabel>
                <FormControl>
                    <Input placeholder="Contoh: industrial machine" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field: { ref, name, onBlur } }) => (
            <FormItem>
              <FormLabel>Gambar Proyek</FormLabel>
              <FormControl>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Klik untuk mengunggah</span> atau seret dan lepas
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, JPEG</p>
                    </div>
                    <Input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageChange}
                      ref={ref}
                      name={name}
                      onBlur={onBlur}
                    />
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative">
                <Image src={src} alt={`Preview ${index}`} width={200} height={200} className="rounded-md object-cover w-full h-32" />
              </div>
            ))}
          </div>
        )}

        <Button type="submit" disabled={loading || loadingAi} className="w-full">
          {(loading || loadingAi) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Tambahkan Portofolio
        </Button>
      </form>
    </Form>
  );
}
