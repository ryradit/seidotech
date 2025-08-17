
'use client';

import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Cog, Layers, Truck, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { FadeIn } from '../../components/ui/fade-in';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogClose } from "../../components/ui/dialog";
import { useState } from 'react';
import { Badge } from "../../components/ui/badge";

const bubutServices = [
  { name: "Jasa Bubut CNC", hint: "CNC lathe", description: "Layanan pemotongan presisi menggunakan mesin bubut CNC.", imageUrl: "/cnc1.jpg" },
  { name: "Jasa Milling CNC", hint: "CNC milling", description: "Pembuatan komponen kompleks dengan mesin milling CNC.", imageUrl: "/millingcnc.jpg" },
  { name: "Jasa Perbaikan Mesin Bubut", hint: "machine repair", description: "Perbaikan dan pemeliharaan untuk semua jenis mesin bubut.", imageUrl: "/mesinbubut.jpg" },
  { name: "Jasa Fabrikasi mesin Industri", hint: "industrial machinery", description: "Pembuatan mesin industri kustom sesuai kebutuhan Anda.", imageUrl: "/fabrikasimesinindustri.jpg" },
  { name: "Jasa Bubut Baut & Mur Costum", hint: "custom bolts", description: "Produksi baut dan mur dengan spesifikasi khusus.", imageUrl: "/bubutbautmurcustom.jpg" },
  { name: "Jasa Pembuatan Gear Khusus", hint: "custom gears", description: "Pembuatan roda gigi presisi untuk berbagai aplikasi.", imageUrl: "/jasagearbubut.jpg" },
  { name: "Jasa Machining CNC dll", hint: "CNC machining", description: "Berbagai layanan permesinan CNC lainnya untuk hasil presisi.", imageUrl: "/jasamachiningcnc.jpg" },
];

const mouldingServices = [
  { name: "Jasa pembuatan Mold / Die casting", hint: "die casting", description: "Pembuatan cetakan presisi untuk die casting logam.", imageUrl: "/jasamolddiecasting.jpg" },
  { name: "Jasa pembuatan mold blow molding", hint: "blow molding", description: "Produksi cetakan untuk proses blow molding plastik.", imageUrl: "/jasamoldblowmolding.jpg" },
  { name: "Jasa maintenance mold", hint: "mold maintenance", description: "Perawatan rutin untuk menjaga performa cetakan Anda.", imageUrl: "/jasamaintanancemold.jpg" },
  { name: "Jasa perbaikan mold plastik", hint: "mold repair", description: "Perbaikan dan restorasi cetakan plastik yang rusak.", imageUrl: "/jasaperbaikanmoldplastik.jpg" },
];

const conveyorServices = [
  { name: "Jasa fabrikasi conveyor industri makanan", hint: "food conveyor", description: "Conveyor higienis dan efisien untuk industri makanan.", imageUrl: "/jasafabrikasiconveyorindustrimakanan.jpg" },
  { name: "Desain fabrikasi conveyor industri minuman", hint: "beverage conveyor", description: "Solusi conveyor untuk lini produksi industri minuman.", imageUrl: "/jasafabrikasiconveyorindustriminuman.jpg" },
  { name: "Jasa modifikasi conveyor industri", hint: "conveyor modification", description: "Modifikasi dan peningkatan sistem conveyor yang ada.", imageUrl: "/jasamodifikasiconveyorindustri.jpg" },
  { name: "Jasa Fabrikasi Conveyor untuk Restoran / Conveyor Sushi", hint: "sushi conveyor", description: "Pembuatan conveyor belt khusus untuk restoran dan bar sushi.", imageUrl: "/jasafabrikasiconveyorrestoatausushi.jpg" },
  { name: "Jasa Pembuatan Spare Part Conveyor Custom", hint: "conveyor parts", description: "Produksi suku cadang conveyor sesuai pesanan.", imageUrl: "/jasapembuatansparepartconveyorsutom.jpg" },
];

const ServiceCard = ({ 
  name, 
  hint, 
  description, 
  imageUrl,
  index,
  category
}: { 
  name: string, 
  hint: string, 
  description: string, 
  imageUrl: string,
  index: number,
  category: string
}) => {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <Card className="overflow-hidden group border border-border/50 hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col backdrop-blur-sm bg-card/60">
        <div className="relative overflow-hidden h-48">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 z-10">
            <Button 
              variant="secondary" 
              size="sm"
              className="gap-1 backdrop-blur-md bg-white/20 hover:bg-white/30 text-white border-white/20"
              onClick={() => setShowModal(true)}
            >
              <ZoomIn className="h-4 w-4" />
              Lihat Detail
            </Button>
          </div>
          <Image
            src={imageUrl}
            alt={name}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            data-ai-hint={hint}
          />
          <Badge className="absolute top-2 right-2 backdrop-blur-md bg-primary/80">{category}</Badge>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardContent>
      </Card>

      {/* Image Zoom Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-4xl p-0 bg-transparent border-none">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <DialogClose className="absolute top-4 right-4 z-50">
              <Button variant="ghost" size="icon" className="bg-black/40 hover:bg-black/60 text-white rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
            
            <div className="flex flex-col">
              <div className="relative h-[50vh] md:h-[70vh]">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  priority
                />
              </div>
              <div className="bg-black/80 p-4 text-white">
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <p className="text-gray-300">{description}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function LayananPage() {
  const [activeSection, setActiveSection] = useState('all');
  
  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-slate-50/10 dark:from-background dark:to-slate-900/5">
        <div className="relative">
          <FadeIn direction="down">
            <section id="services-intro" className="w-full py-12 md:py-24 lg:py-32 relative">
              <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="inline-block rounded-lg bg-secondary/80 backdrop-blur-md px-3 py-1 text-sm text-secondary-foreground">Layanan Kami</div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl font-headline bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Solusi Engineering Komprehensif
                  </h1>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Adapun Jasa pengerjaan yang Perusahaan kami tawarkan adalah sebagai berikut, masing-masing dengan keahlian dan presisi tinggi.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center mt-8">
                    <Button 
                      variant={activeSection === 'all' ? "default" : "outline"} 
                      size="sm"
                      className={activeSection === 'all' ? "" : "border-border/50"}
                      onClick={() => setActiveSection('all')}
                    >
                      Semua Layanan
                    </Button>
                    <Button 
                      variant={activeSection === 'bubut' ? "default" : "outline"} 
                      size="sm"
                      className={activeSection === 'bubut' ? "" : "border-border/50"}
                      onClick={() => setActiveSection('bubut')}
                    >
                      Jasa Bubut
                    </Button>
                    <Button 
                      variant={activeSection === 'moulding' ? "default" : "outline"} 
                      size="sm"
                      className={activeSection === 'moulding' ? "" : "border-border/50"}
                      onClick={() => setActiveSection('moulding')}
                    >
                      Jasa Moulding
                    </Button>
                    <Button 
                      variant={activeSection === 'conveyor' ? "default" : "outline"} 
                      size="sm"
                      className={activeSection === 'conveyor' ? "" : "border-border/50"}
                      onClick={() => setActiveSection('conveyor')}
                    >
                      Jasa Conveyor
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Subtle decorative elements similar to portfolio */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-20 left-10 w-24 h-24 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute top-40 right-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              </div>
            </section>
          </FadeIn>
        </div>

        {/* Main service sections that respond to filters */}
        <div className="relative z-10">
          {/* Jasa Bubut Section */}
          <FadeIn>
            <section id="bubut" className={`w-full py-12 md:py-24 ${activeSection !== 'all' && activeSection !== 'bubut' ? 'hidden' : ''}`}>
              <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-12">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
                        <Cog className="h-10 w-10 text-primary" />
                      </div>
                      <span>Jasa Bubut</span>
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground">
                      Perusahaan bubut kami melayani berbagai proses jasa untuk menghasilkan komponen presisi sesuai kebutuhan Anda.
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {bubutServices.map((service, index) => (
                    <FadeIn key={index} delay={index * 0.1}>
                      <ServiceCard {...service} index={index} category="Bubut" />
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          </FadeIn>

          {/* Jasa Moulding Section */}
          <FadeIn>
            <section id="moulding" className={`w-full py-12 md:py-24 ${activeSection !== 'all' && activeSection !== 'moulding' ? 'hidden' : ''}`}>
              <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-12">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
                        <Layers className="h-10 w-10 text-primary" />
                      </div>
                      <span>Jasa Moulding</span>
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground">
                      Kami menyediakan jasa pembuatan, perawatan, dan perbaikan moulding untuk berbagai aplikasi industri.
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {mouldingServices.map((service, index) => (
                    <FadeIn key={index} delay={index * 0.1}>
                      <ServiceCard {...service} index={index} category="Moulding" />
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          </FadeIn>

          {/* Jasa Fabrikasi Conveyor Section */}
          <FadeIn>
            <section id="conveyor" className={`w-full py-12 md:py-24 ${activeSection !== 'all' && activeSection !== 'conveyor' ? 'hidden' : ''}`}>
              <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-12">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
                        <Truck className="h-10 w-10 text-primary" />
                      </div>
                      <span>Jasa Fabrikasi Conveyor</span>
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground">
                      Layanan fabrikasi conveyor kami melayani pembuatan conveyor custom untuk berbagai industri.
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {conveyorServices.map((service, index) => (
                    <FadeIn key={index} delay={index * 0.1}>
                      <ServiceCard {...service} index={index} category="Conveyor" />
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          </FadeIn>
        </div>

        {/* Interactive Call to Action */}
        <FadeIn>
          <section className="w-full py-16">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                <div className="inline-block rounded-lg bg-primary/10 backdrop-blur-md px-3 py-1 text-sm text-primary mb-4">Konsultasi Gratis</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                  Butuh Bantuan Untuk Proyek Anda?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl">
                  Tim ahli kami siap membantu Anda menemukan solusi terbaik untuk kebutuhan engineering dan fabrikasi Anda.
                  Konsultasikan proyek Anda sekarang untuk mendapatkan estimasi gratis.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" className="gap-2 group">
                    Hubungi Kami
                    <svg 
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="lg" className="border-border/50">
                    Lihat Portfolio
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </main>
      <Footer />
    </>
  );
}
