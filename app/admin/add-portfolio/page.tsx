
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PortfolioForm } from '@/components/portfolio-form';

export default function AddPortfolioPage() {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
            <Card>
            <CardHeader>
                <CardTitle>Tambah Portofolio Baru</CardTitle>
                <CardDescription>
                Isi formulir di bawah ini untuk menambahkan proyek baru ke halaman portofolio Anda.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <PortfolioForm />
            </CardContent>
            </Card>
        </div>
    </main>
  );
}
