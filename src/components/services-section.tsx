
import { Cog, Layers, Truck, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { GlowCard } from './ui/glow-card';
import { CardTitle } from './ui/card';

const bubutServices = [
  "Jasa Bubut CNC",
  "Jasa Milling CNC",
  "Jasa Perbaikan Mesin Bubut",
  "Jasa Fabrikasi mesin Industri",
];

const mouldingServices = [
  "Jasa pembuatan Mold / Die casting",
  "Jasa pembuatan mold blow molding",
  "Jasa maintenance mold",
  "Jasa perbaikan mold plastik",
];

const conveyorServices = [
  "Jasa fabrikasi conveyor industri makanan",
  "Desain fabrikasi conveyor industri minuman",
  "Jasa modifiaksi conveyor industri",
];

const ServiceCardContent = ({ title, services }: { title: string, services: string[] }) => (
  <div className="flex flex-col h-full">
    <div className="flex flex-row items-center gap-4 mb-4">
      <CardTitle className="text-white">{title}</CardTitle>
    </div>
    <div className="flex-grow">
      <ul className="space-y-2 text-left">
        {services.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
            <span className="text-gray-300">{item}</span>
          </li>
        ))}
         <li className="flex items-start gap-2">
            <Check className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
            <span className="text-gray-300">dan lainnya...</span>
          </li>
      </ul>
    </div>
  </div>
);


export function ServicesSection() {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Layanan Kami</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Solusi Engineering Komprehensif</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Berikut adalah ringkasan jasa pengerjaan yang Perusahaan kami tawarkan. Lihat detail selengkapnya di halaman layanan kami.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-3 mt-12">
          <GlowCard glowColor="orange" customSize className="p-6">
            <ServiceCardContent title="Jasa Bubut" services={bubutServices} />
          </GlowCard>
          <GlowCard glowColor="orange" customSize className="p-6">
            <ServiceCardContent title="Jasa Moulding" services={mouldingServices} />
          </GlowCard>
          <GlowCard glowColor="orange" customSize className="p-6">
            <ServiceCardContent title="Jasa Fabrikasi Conveyor" services={conveyorServices} />
          </GlowCard>
        </div>
        <div className="text-center mt-12">
            <Link href="/layanan" prefetch={false}>
              <Button>
                Lihat Semua Layanan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
