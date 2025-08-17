'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Handshake, Loader2, PlusCircle, Building, Trash2 } from "lucide-react";
import { useToast } from '../../../hooks/use-toast';
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
} from "../../../components/ui/alert-dialog";

interface Mitra {
  id: string;
  name: string;
  createdAt: string;
}

export default function MitraPage() {
    const [mitras, setMitras] = useState<Mitra[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [newMitraName, setNewMitraName] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const { toast } = useToast();

    // Fetch mitras from portfolios with category filter
    const fetchMitras = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('portfolios')
                .select('id, title, createdAt')
                .eq('category', 'Partnership') // Only fetch partnerships
                .order('createdAt', { ascending: false });
            
            if (error) throw error;
            
            // Transform portfolio data to mitra format
            const mitraData: Mitra[] = data?.map(portfolio => ({
                id: portfolio.id,
                name: portfolio.title,
                createdAt: portfolio.createdAt
            })) || [];
            
            setMitras(mitraData);
        } catch (error) {
            console.error('Error fetching mitras:', error);
            toast({
                variant: 'destructive',
                title: 'Gagal memuat data mitra',
                description: 'Terjadi kesalahan saat mengambil data dari server.',
            });
        } finally {
            setLoading(false);
        }
    };

    // Add new mitra (creates portfolio with Partnership category)
    const handleAddMitra = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMitraName.trim()) return;

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('portfolios')
                .insert([{
                    title: newMitraName.trim(),
                    category: 'Partnership', // Fixed category for mitras
                    description: `Mitra kerjasama dengan ${newMitraName.trim()}`,
                    imageUrls: [],
                    createdAt: new Date().toISOString()
                }]);

            if (error) throw error;

            toast({
                title: 'Sukses',
                description: 'Mitra baru berhasil ditambahkan.',
            });

            setNewMitraName('');
            setShowAddForm(false);
            fetchMitras();
        } catch (error) {
            console.error('Error adding mitra:', error);
            toast({
                variant: 'destructive',
                title: 'Gagal menambah mitra',
                description: 'Terjadi kesalahan saat menyimpan data.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Delete mitra (only deletes Partnership category entries)
    const handleDeleteMitra = async (mitraId: string) => {
        setDeletingId(mitraId);
        try {
            // First verify it's a Partnership category
            const { data: checkData, error: checkError } = await supabase
                .from('portfolios')
                .select('category')
                .eq('id', mitraId)
                .single();

            if (checkError) throw checkError;
            
            if (checkData.category !== 'Partnership') {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Tidak dapat menghapus entry yang bukan mitra.',
                });
                return;
            }

            const { error } = await supabase
                .from('portfolios')
                .delete()
                .eq('id', mitraId)
                .eq('category', 'Partnership'); // Extra safety check

            if (error) throw error;

            toast({
                title: 'Sukses',
                description: 'Mitra berhasil dihapus.',
            });
            fetchMitras();
        } catch (error) {
            console.error('Error deleting mitra:', error);
            toast({
                variant: 'destructive',
                title: 'Gagal menghapus mitra',
                description: 'Terjadi kesalahan saat menghapus data.',
            });
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchMitras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                        Kelola Mitra
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Mengelola daftar mitra kerjasama (hanya kategori Partnership)
                    </p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Mitra
                </Button>
            </div>

            {/* Add Mitra Form */}
            {showAddForm && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Tambah Mitra Baru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddMitra} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="mitraName">Nama Mitra</Label>
                                <Input
                                    id="mitraName"
                                    value={newMitraName}
                                    onChange={(e) => setNewMitraName(e.target.value)}
                                    placeholder="Masukkan nama perusahaan mitra"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Akan dibuat sebagai portfolio dengan kategori "Partnership"
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan'
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Mitra List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Handshake className="h-6 w-6 text-primary" />
                        <span>Daftar Mitra ({mitras.length})</span>
                        <Badge variant="outline" className="text-xs">Partnership</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {mitras.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {mitras.map((mitra) => (
                                <Card key={mitra.id} className="border border-border">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Building className="h-4 w-4 text-primary" />
                                                    <h3 className="font-semibold text-sm line-clamp-2">
                                                        {mitra.name}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {new Date(mitra.createdAt).toLocaleDateString('id-ID')}
                                                    </Badge>
                                                    <Badge variant="secondary" className="text-xs">
                                                        Partnership
                                                    </Badge>
                                                </div>
                                            </div>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        disabled={deletingId === mitra.id}
                                                    >
                                                        {deletingId === mitra.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-3 w-3" />
                                                        )}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Hapus Mitra</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Apakah Anda yakin ingin menghapus "{mitra.name}" dari daftar mitra?
                                                            Ini akan menghapus entry dari portfolio dengan kategori Partnership.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction 
                                                            onClick={() => handleDeleteMitra(mitra.id)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Hapus
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <Building className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground mb-4">Belum ada mitra yang terdaftar.</p>
                            <Button onClick={() => setShowAddForm(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah Mitra Pertama
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-8 border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-yellow-600">ℹ️</div>
                        <div className="text-sm">
                            <p className="font-medium text-yellow-800 mb-1">Informasi</p>
                            <p className="text-yellow-700">
                                Mitra disimpan sebagai portfolio dengan kategori "Partnership". 
                                Hanya entry dengan kategori ini yang ditampilkan dan dapat dihapus di halaman ini.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}