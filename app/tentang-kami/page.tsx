'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Building, Users, Target, Info, Package, Truck } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/ui/fade-in'

export default function TentangKamiPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <FadeIn direction="down">
          <section className="w-full py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Tentang Kami
                  </h1>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      PT. Seido Mitra Abadi adalah perusahaan manufaktur dan engineering yang berkomitmen untuk menyediakan solusi berkualitas tinggi dalam bidang industri, khususnya di sektor Conveyor dan Molding.
                    </p>
                    <p className="text-muted-foreground">
                      Didirikan dengan visi untuk menjadi pemimpin industri di Indonesia, kami telah melayani berbagai perusahaan dari skala kecil hingga besar di wilayah Tangerang, Jakarta, dan sekitarnya, bahkan hingga ke luar pulau Jawa.
                    </p>
                    <p className="text-muted-foreground">
                      Dengan tim ahli yang berpengalaman dan fasilitas produksi modern, kami menawarkan layanan komprehensif mulai dari desain, manufaktur, instalasi, hingga maintenance untuk memastikan kepuasan pelanggan.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src="/dedikasi.png"
                    width={600}
                    height={400}
                    alt="About Us Image"
                    className="rounded-xl shadow-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="w-full py-12 bg-gradient-to-r from-primary to-primary/80">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                <div className="space-y-2">
                  <h3 className="text-4xl font-bold">300+</h3>
                  <p className="text-sm opacity-80">Proyek Selesai</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-bold">100+</h3>
                  <p className="text-sm opacity-80">Klien Puas</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-bold">50+</h3>
                  <p className="text-sm opacity-80">Proyek Berjalan</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-bold">15+</h3>
                  <p className="text-sm opacity-80">Tahun Pengalaman</p>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="w-full py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Mengapa Memilih Kami</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="relative overflow-hidden rounded-xl group">
                  <Image
                    src="/jasafabrikasiconveyor.jpg"
                    width={400}
                    height={300}
                    alt="Pengalaman & Keahlian"
                    className="object-cover w-full h-[200px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                    <h3 className="text-white font-semibold mb-2">Pengalaman & Keahlian</h3>
                    <p className="text-white/80 text-sm">Tim ahli kami memiliki pengalaman lebih dari 15 tahun dalam industri manufaktur dan engineering.</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl group">
                  <Image
                    src="/jasamolddiecasting.jpg"
                    width={400}
                    height={300}
                    alt="Kualitas Terjamin"
                    className="object-cover w-full h-[200px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                    <h3 className="text-white font-semibold mb-2">Kualitas Terjamin</h3>
                    <p className="text-white/80 text-sm">Setiap produk melalui quality control ketat untuk memastikan standar kualitas tertinggi.</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl group">
                  <Image
                    src="/mesinbubut.jpg"
                    width={400}
                    height={300}
                    alt="Layanan Komprehensif"
                    className="object-cover w-full h-[200px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                    <h3 className="text-white font-semibold mb-2">Layanan Komprehensif</h3>
                    <p className="text-white/80 text-sm">Solusi lengkap dari desain, manufaktur, instalasi hingga maintenance untuk kebutuhan industri Anda.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
        
        <FadeIn>
          <section className="w-full py-12 md:py-24 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Layanan Kami</h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Injection Molding</h3>
                  <p className="text-sm text-muted-foreground">Jasa pembuatan dan perbaikan mold dengan kapasitas mesin 50-1500 ton untuk berbagai kebutuhan industri.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Sistem Conveyor</h3>
                  <p className="text-sm text-muted-foreground">Fabrikasi dan instalasi berbagai jenis conveyor seperti Belt, Roller, dan Chain Conveyor untuk industri.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Machining CNC</h3>
                  <p className="text-sm text-muted-foreground">Pengerjaan spare part presisi dengan mesin CNC modern untuk hasil akurat dan konsisten.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Maintenance</h3>
                  <p className="text-sm text-muted-foreground">Layanan perawatan berkala dan perbaikan untuk menjaga performa optimal peralatan industri.</p>
                </div>
              </div>
              <div className="mt-12 text-center">
                <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
                  <Link href="/layanan" className="text-white">
                    Lihat Selengkapnya
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="w-full py-12 bg-gradient-to-br from-background to-secondary/20">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Mitra Kami</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-border">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">PT Astra Honda Motor</h3>
                    <p className="text-sm text-muted-foreground">Proyek: Hanger Conveyor System</p>
                  </div>
                </div>
                <div className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">PT Conch Semen Indonesia</h3>
                    <p className="text-sm text-muted-foreground">Proyek: Rubber Belt System</p>
                  </div>
                </div>
                <div className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">PT MRT Jakarta</h3>
                    <p className="text-sm text-muted-foreground">Proyek: Bike Conveyor System</p>
                  </div>
                </div>
                <div className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">PT Sukses Cipta Makmur</h3>
                    <p className="text-sm text-muted-foreground">Proyek: Oven Conveyor System</p>
                  </div>
                </div>
                <div className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">PT Surya Perkasa Balaraja</h3>
                    <p className="text-sm text-muted-foreground">Proyek: Custom Conveyor System</p>
                  </div>
                </div>
                <div className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">PT Trans Universal Sejahtera</h3>
                    <p className="text-sm text-muted-foreground">Proyek: Industrial Conveyor System</p>
                  </div>
                </div>
              </div>
              <div className="mt-12 text-center">
                <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
                  <Link href="/portfolio" className="text-white">
                    Lihat Selengkapnya
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
}
