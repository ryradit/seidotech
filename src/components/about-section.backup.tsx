'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  ArrowRight, 
  Building2, 
  Users, 
            <MotionDiv 
                className="grid md:grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >,
  Target,
  Workflow,
  Clock,
  CheckCircle2,
  Wrench,
  Factory,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const MotionDiv = motion.div;
const MotionImage = motion(Image);

// Services data
const mainServices = [
  {
    id: 'bubut',
    title: 'Machining Service',
    description: 'Presisi tinggi dalam pengerjaan bubut & milling CNC untuk berbagai kebutuhan industri.',
    features: ['Bubut & Milling CNC', 'Fabrikasi Komponen', 'Pembuatan Gear', 'Material Berkualitas'],
    image: '/mesinbubut.jpg'
  },
  {
    id: 'mold',
    title: 'Injection Molding',
    description: 'Solusi lengkap untuk kebutuhan molding plastik dengan standar kualitas tinggi.',
    features: ['Die Casting', 'Blow Molding', 'Perbaikan Mold', 'Konsultasi Design'],
    image: '/jasamolddiecasting.jpg'
  },
  {
    id: 'conveyor',
    title: 'Conveyor Systems',
    description: 'Sistem conveyor modern untuk optimalisasi proses produksi dan material handling.',
    features: ['Belt Conveyor', 'Roller Conveyor', 'Chain Conveyor', 'Custom Design'],
    image: '/jasafabrikasiconveyor.jpg'
  }
];

export function AboutSection() {
  const [activeService, setActiveService] = useState(mainServices[0]);
  
  const stats = [
    { value: '20+', label: 'Tahun Pengalaman', icon: Clock },
    { value: '35+', label: 'Tim Ahli', icon: Users },
    { value: '1750+', label: 'Proyek Selesai', icon: Trophy },
    { value: '120+', label: 'Klien Aktif', icon: Building2 },
  ];

  const whyUs = [
    {
      icon: Wrench,
      title: 'Keahlian Teknis',
      description: 'Tim ahli berpengalaman dengan standar kualitas tinggi'
    },
    {
      icon: Workflow,
      title: 'Proses Efisien',
      description: 'Pengerjaan cepat dan tepat waktu dengan hasil maksimal'
    },
    {
      icon: Factory,
      title: 'Fasilitas Modern',
      description: 'Peralatan dan teknologi manufaktur terkini'
    }
  ];

  const supportServices = [
    {
      icon: Wrench,
      title: 'Desain & Engineering',
      description: 'Solusi desain dan engineering untuk kebutuhan industri Anda'
    },
    {
      icon: Factory,
      title: 'Manufaktur',
      description: 'Proses produksi dengan presisi dan kualitas tinggi'
    },
    {
      icon: CheckCircle2,
      title: 'Quality Control',
      description: 'Pengawasan mutu di setiap tahap produksi'
    }
  ];

  return (
    <>
      <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <MotionDiv 
            className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                  Tentang Kami
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Dedikasi untuk Keunggulan Engineering
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  PT. Seido Mitra Abadi adalah perusahaan manufaktur dan engineering yang berkomitmen menyediakan solusi inovatif untuk kebutuhan industri Anda.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Target className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Visi</h3>
                      <p className="text-sm text-muted-foreground">Menjadi industri Conveyor & Molding terbaik di Indonesia</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Misi</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Menjaga kualitas produk</li>
                        <li>• Perbaikan mutu berkelanjutan</li>
                        <li>• Ketepatan waktu pengiriman</li>
                        <li>• Jaminan layanan terbaik</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Button asChild>
                <Link href="/tentang-kami">
                  Pelajari Lebih Lanjut
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <Image
                src="/dedikasi.png"
                alt="Engineering Team Seido"
                width={600}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <MotionDiv 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <Card key={index} className="border-none bg-background/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 mb-4 mx-auto text-primary" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <MotionDiv
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Mengapa Memilih Kami</h2>
            <p className="text-muted-foreground md:text-lg max-w-[800px] mx-auto">
              Komitmen kami untuk memberikan layanan terbaik dengan standar kualitas tinggi
            </p>
          </motion.div>

          <MotionDiv 
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {whyUs.map((item, index) => (
              <Card key={index} className="relative overflow-hidden group">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );

        {/* Stats Grid */}
      <MotionDiv 
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow"
          >
            <stat.icon className="h-8 w-8 text-primary mb-3" />
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </MotionDiv>

        {/* Services Tabs */}
        <Tabs defaultValue={mainServices[0].id} className="mb-16">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            {mainServices.map((service) => (
              <TabsTrigger
                key={service.id}
                value={service.id}
                onClick={() => setActiveService(service)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              >
                {service.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {mainServices.map((service) => (
            <TabsContent key={service.id} value={service.id}>
              <MotionDiv 
                className="grid md:grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                  <ul className="grid grid-cols-2 gap-3">
                    {service.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-4">
                    <Link href={`/layanan#${service.id}`}>
                      Pelajari Lebih Lanjut
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <MotionDiv 
                  className="relative aspect-video rounded-xl overflow-hidden shadow-lg"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </MotionDiv>
              </MotionDiv>
            </TabsContent>
          ))}
        </Tabs>

        {/* CTA */}
                  </MotionDiv>
        </div>
      </section>

      </section>
      
      <section className="bg-accent/10 py-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Siap untuk Memulai Proyek?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              Kami siap membantu mewujudkan solusi engineering terbaik untuk kebutuhan industri Anda.
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link href="/kontak">
                  Hubungi Kami Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </MotionDiv>
        </div>
      </section>
    </>
  );
    </>
  );
}
      </div>
    </section>
  );
}
