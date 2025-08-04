import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import { CheckCircle, Building, Users, Target, Info, Package, Truck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';

export default function TentangKamiPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <FadeIn direction="down">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Tentang Kami</div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Dedikasi untuk Keunggulan Engineering
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  PT. Seido Mitra Abadi adalah perusahaan manufaktur dan engineering yang berkomitmen menyediakan produk berkualitas tinggi dan solusi inovatif untuk kebutuhan industri Anda.
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                <FadeIn direction="left" className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Visi & Misi Kami
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Target className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                      <div>
                        <h3 className="text-lg font-bold">Visi</h3>
                        <p className="text-muted-foreground">
                          Menjadi industri Conveyor & Molding terbaik di Indonesia
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                      <div>
                        <h3 className="text-lg font-bold">Misi</h3>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                          <li>Menjaga kualitas produk yang dihasilkan</li>
                          <li>Perbaikan terus menerus terhadap mutu</li>
                          <li>On time delivery</li>
                          <li>Peningkatan jaminan layanan garansi</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn direction="right" className="flex items-center justify-center">
                  <Image
                    src="/dedikasi.png"
                    width="600"
                    height="600"
                    alt="Team of engineers discussing plans"
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                    data-ai-hint="engineering team"
                  />
                </FadeIn>
              </div>
            </div>
          </section>
        </FadeIn>
        
        <FadeIn>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Profil Perusahaan
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Detail komitmen dan keahlian kami dalam dunia manufaktur dan engineering.
                  </p>
              </div>
              <div className="mt-12">
                 <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                      <TabsTrigger value="profile">
                        <Info className="mr-2 h-4 w-4" /> Profil Umum
                      </TabsTrigger>
                      <TabsTrigger value="molding">
                        <Package className="mr-2 h-4 w-4" /> Injection Molding
                      </TabsTrigger>
                      <TabsTrigger value="conveyor">
                        <Truck className="mr-2 h-4 w-4" /> Conveyor
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile" className="pt-6">
                       <Card>
                         <CardContent className="p-6 text-muted-foreground space-y-4">
                           <p>
                            <strong>PT. SEIDO MITRA ABADI</strong> telah melayani berbagai konsumen dari kalangan personal, workshop maupun industri terutama di wilayah <strong>Tangerang</strong> dan <strong>Jakarta</strong> hingga luar pulau Jawa. Kami dapat melayani kebutuhan <strong>spare part industri</strong> terutama yang dapat diproses dengan <strong>mesin bubut</strong> maupun <strong>konvensional</strong>. Didukung dengan group bengkel dari rekanan kami, sehingga kami dapat mengerjakan berbagai produk dengan skala ukuran kecil maupun besar.
                           </p>
                           <p>
                            Apapun kebutuhan produk spare part industri anda yang berhubungan dengan <strong>mesin bubut, milling, CNC</strong>, kami dapat memproduksinya. Seperti <strong>moulding plastik injection dan vacuum, roll, bantalan, poros, recover roll karet, teflon</strong> dan berbagai produk lain nya.
                           </p>
                         </CardContent>
                       </Card>
                    </TabsContent>
                    <TabsContent value="molding" className="pt-6">
                       <Card>
                         <CardContent className="p-6 text-muted-foreground space-y-4">
                          <p>
                              Perusahaan kami juga merupakan produsen <strong>Injection Mold</strong> yang berlokasi di wilayah Tangerang, Banten. Kami fokus menangani semua layanan yang berhubungan dengan <strong>molding</strong> baik <strong>produksi, maintenance, dan perbaikan mold</strong>. <strong>Plastic Injection Mold</strong> adalah alat yang digunakan pada manufaktur plastik, untuk membuat produk dengan bentuk dan ukuran presisi.
                          </p>
                          <p>
                              Kami melayani pembuatan molding untuk kapasitas <strong>mesin injection</strong> mulai dari 50 ton sampai dengan 1.500 ton. Contoh produk yang pernah kami buat antara lain <strong>peralatan rumah tangga, part otomotif, engine part, dan produk industrial</strong> lainnya.
                          </p>
                          <p>
                              Dengan pengalaman panjang, kami ahli menangani permasalahan seperti <strong>flashing (kelebihan produk)</strong> dan dapat mereparasi <strong>cetakan</strong> yang bermasalah. Kami juga membuat cetakan untuk berbagai produk rumah tangga dan part otomotif presisi tinggi menggunakan <strong>mesin CNC</strong>.
                          </p>
                          <p>
                              Kami menjamin kepresisian dan kualitas produk, menggunakan <strong>material plastik</strong> seperti <strong>PE, PC, dan HDPE</strong>. Konstruksi mold bisa beragam, termasuk <strong>T-plate dan family mold</strong>, serta pembuatan komponen <strong>spare part mold</strong>.
                          </p>
                         </CardContent>
                       </Card>
                    </TabsContent>
                    <TabsContent value="conveyor" className="pt-6">
                       <Card>
                         <CardContent className="p-6 text-muted-foreground space-y-4">
                           <p>
                              <strong>PT Seido Mitra Abadi</strong> juga bergerak di bidang <strong>Conveyor</strong>, meliputi <strong>jasa fabrikasi, penjualan spare part, perbaikan, serta desain dan perancangan</strong>. Produk conveyor kami dapat dimanfaatkan di berbagai industri seperti <strong>pertambangan, makanan, karet, otomotif</strong>, dan lainnya.
                           </p>
                           <p>
                             Tenaga ahli kami sangat berpengalaman, mulai dari <strong>desain fabrikasi</strong> hingga <strong>perawatan (maintenance)</strong>, yang kami kelola dengan baik. <strong>Industri makanan</strong> adalah salah satu sektor yang paling banyak menggunakan produk kami.
                           </p>
                           <p>
                             Apapun kebutuhan Anda di bidang conveyor, kami siap membantu memberikan solusi total dan layanan terbaik.
                           </p>
                         </CardContent>
                       </Card>
                    </TabsContent>
                  </Tabs>
              </div>
            </div>
          </section>
        </FadeIn>

      </main>
      <Footer />
    </div>
  );
}
