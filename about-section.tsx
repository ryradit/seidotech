'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Building2, 
  Users, 
  Trophy,
  Target,
  Workflow,
  Clock,
  CheckCircle2,
  Wrench,
  Factory
} from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

export function AboutSection() {
  const stats = [
    { value: '15+', label: 'Tahun Pengalaman', icon: Clock },
    { value: '20+', label: 'Tim Profesional', icon: Users },
    { value: '300+', label: 'Proyek Selesai', icon: Trophy },
    { value: '100+', label: 'Klien Puas', icon: Building2 },
  ];

  const whyUs = [
    {
      icon: Wrench,
      title: 'Keahlian Teknis',
      description: 'Tim berpengalaman dalam fabrikasi conveyor dan injection molding dengan standar kualitas tinggi'
    },
    {
      icon: Workflow,
      title: 'Layanan Terintegrasi',
      description: 'Solusi lengkap dari desain, manufaktur, instalasi hingga maintenance untuk berbagai kebutuhan industri'
    },
    {
      icon: Factory,
      title: 'Fasilitas Lengkap',
      description: 'Peralatan manufaktur modern termasuk mesin CNC dan kapasitas molding 50-1500 ton'
    }
  ];

  return (
    <>
      <section id="about" className="w-full py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <MotionDiv 
            className="grid gap-16 lg:grid-cols-2 items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-600">
                  Tentang Kami
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Dedikasi untuk Keunggulan Engineering
                </h1>
                <div className="space-y-4">
                  <p className="text-base text-gray-600">
                    PT. Seido Mitra Abadi adalah perusahaan manufaktur dan engineering yang berkomitmen untuk menyediakan solusi berkualitas tinggi dalam bidang industri, khususnya di sektor Conveyor dan Molding.
                  </p>
                  <p className="text-base text-gray-600">
                    Dengan pengalaman lebih dari 15 tahun, kami telah melayani berbagai perusahaan dari skala kecil hingga besar di wilayah Tangerang, Jakarta, dan sekitarnya, bahkan hingga ke luar pulau Jawa.
                  </p>
                  <p className="text-base text-gray-600">
                    Kami menawarkan solusi lengkap mulai dari desain, manufaktur, instalasi, hingga maintenance dengan standar kualitas tinggi dan pelayanan profesional untuk memastikan kepuasan setiap klien.
                  </p>
                </div>
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

              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link href="/tentang-kami" className="inline-flex items-center">
                  Pelajari Lebih Lanjut
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative lg:mt-0 mt-8">
              <Image
                src="/dedikasi.png"
                alt="Engineering Team Seido"
                width={600}
                height={450}
                className="rounded-xl shadow-2xl object-cover"
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-[2rem] -z-10" />
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
        <div className="container mx-auto px-4 md:px-6">
          <MotionDiv 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <Card key={index} className="border-none bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <stat.icon className="h-10 w-10 mb-4 mx-auto text-orange-500" />
                  <div className="text-4xl font-bold mb-2 text-orange-600">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <MotionDiv
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block rounded-lg bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-600 mb-4">
              Keunggulan Kami
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Mengapa Memilih Kami</h2>
            <p className="text-gray-600 max-w-[800px] mx-auto">
              Pengalaman lebih dari 15 tahun dalam industri manufaktur dan engineering dengan berbagai proyek sukses menjadi bukti komitmen kami terhadap kualitas dan kepuasan pelanggan.
            </p>
          </MotionDiv>

          <MotionDiv 
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {whyUs.map((item, index) => (
              <Card key={index} className="bg-white border-0 shadow-none group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-50 rounded flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                    <item.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </MotionDiv>
        </div>
      </section>
    </>
  );
}
