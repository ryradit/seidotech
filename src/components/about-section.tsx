import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Tentang Kami</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Dedikasi untuk Keunggulan Engineering
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              PT. Seido Mitra Abadi adalah perusahaan manufaktur dan engineering yang berkomitmen menyediakan produk berkualitas tinggi dan solusi inovatif untuk kebutuhan industri Anda.
            </p>
            <Link href="/tentang-kami" prefetch={false}>
              <Button>
                Lihat Selengkapnya
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="/dedikasi.png"
              width="600"
              height="600"
              alt="Team of engineers discussing plans"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              data-ai-hint="engineering team"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
