import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white">
      <Image
        src="/bannerhero.png"
        alt="Industrial machinery in a modern factory"
        fill
        className="absolute inset-0 z-0 object-cover brightness-50"
        data-ai-hint="industrial machinery"
        priority
      />
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline">
            Solusi Manufaktur & Engineering Presisi Tinggi
          </h1>
          <p className="text-lg text-gray-200 md:text-xl">
            PT. Seido Mitra Abadi: Partner terpercaya Anda dalam CNC Machining, Molding, dan Fabrikasi Conveyor.
          </p>
          <div>
            <Link href="/kontak" prefetch={false}>
              <Button size="lg">
                Mulai Konsultasi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
