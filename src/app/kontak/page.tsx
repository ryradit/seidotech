
'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Building2, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/fade-in';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save message to Supabase
      const { error } = await supabase.from('contact_messages').insert([
        {
          name,
          email,
          subject,
          message,
          status: 'unread',
          created_at: new Date().toISOString()
        }
      ]);
      
      if (error) throw error;
      
      // Also send email notification to juanrengga@gmail.com
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('message', `Subject: ${subject}\n\n${message}`);
      formData.append('_captcha', 'false');
      formData.append('_subject', `Contact Form: ${subject}`);
      
      // Use FormSubmit.co service to send email
      await fetch('https://formsubmit.co/juanrengga@gmail.com', {
        method: 'POST',
        body: formData
      });
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      
      toast.success('Pesan berhasil dikirim!', {
        description: 'Kami akan segera menghubungi Anda.',
        duration: 5000,
        position: 'top-center',
        action: {
          label: 'OK',
          onClick: () => console.log('Notification acknowledged')
        },
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Gagal mengirim pesan', {
        description: 'Silakan coba lagi nanti.',
        duration: 5000,
        position: 'top-center',
        action: {
          label: 'Tutup',
          onClick: () => console.log('Error notification closed')
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nama</label>
              <input
                  id="name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Masukkan nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
              />
          </div>
          <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
              <input
                  id="email"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
          </div>
      </div>
      <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Subjek</label>
          <input
              id="subject"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Subjek pesan"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
          />
      </div>
      <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Pesan</label>
          <textarea
              id="message"
              className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tulis pesan Anda di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
          ></textarea>
      </div>
      <button 
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            'Kirim Pesan'
          )}
      </button>
    </form>
  );
}

interface WhatsAppLineType {
  type: 'whatsapp';
  number: string;
}

interface EmailLineType {
  type: 'email';
  address: string;
}

type ContactLineType = WhatsAppLineType | EmailLineType;

interface ContactDetailType {
  icon: any;
  title: string;
  lines: ContactLineType[];
}

interface AddressDetailType {
  icon: any;
  title: string;
  address: string;
}

const WhatsAppLink = ({ number, children }: { number: string; children: React.ReactNode }) => {
  const cleanNumber = number.startsWith('0') ? '62' + number.substring(1) : number;
  const message = encodeURIComponent('Halo, saya ingin bertanya tentang layanan Seido.');
  return (
    <Link 
      href={`https://wa.me/${cleanNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
    >
      <MessageSquare className="h-4 w-4 text-green-500 group-hover:text-primary flex-shrink-0" />
      <span>{children}</span>
    </Link>
  );
};


const contactDetails: ContactDetailType[] = [
  {
    icon: Phone,
    title: "Telepon",
    lines: [
        { type: 'whatsapp', number: '0817307887' },
        { type: 'whatsapp', number: '08119057887' }
    ]
  },
  {
    icon: Phone,
    title: "Admin",
    lines: [
        { type: 'whatsapp', number: '081219351100' }
    ]
  },
  {
    icon: Mail,
    title: "Email",
    lines: [
        { type: 'email', address: 'ptseido@gmail.com' },
        { type: 'email', address: 'info@seido.co.id' }
    ]
  }
];

const addressDetails: AddressDetailType[] = [
  {
    icon: Building2,
    title: "Office",
    address: "Ruko Bumi Indah Tahap 1 Blok RB Nomor 10, Kuta jaya Pasar Kemis Tangerang – Banten"
  },
  {
    icon: Building2,
    title: "Workshop",
    address: "JL. Boulevard raya Ruko Regensi 2 Blok AB 2 No.16, Kuta jaya Pasar Kemis Tangerang – Banten"
  }
];


export default function KontakPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <FadeIn direction="down">
          <section id="contact-hero" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Hubungi Kami</div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Mari Terhubung
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Kami siap membantu menjawab pertanyaan Anda dan mendiskusikan kebutuhan proyek Anda.
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section id="contact-info" className="w-full pb-12 md:pb-24">
              <div className="container mx-auto px-4 md:px-6">
                  <div className="grid gap-8 md:grid-cols-2">
                      <FadeIn direction="left">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Kontak</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {contactDetails.map((detail, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <detail.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold">{detail.title}</h3>
                                            <div className="text-muted-foreground space-y-1">
                                                {detail.lines.map((line, i) => {
                                                    if (line.type === 'whatsapp') {
                                                        return <WhatsAppLink key={i} number={(line as WhatsAppLineType).number}>{(line as WhatsAppLineType).number}</WhatsAppLink>
                                                    }
                                                    if (line.type === 'email') {
                                                        return <div key={i}><a href={`mailto:${(line as EmailLineType).address}`} className="hover:text-primary">{(line as EmailLineType).address}</a></div>
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="border-t pt-6 mt-6">
                                    <h3 className="font-semibold text-lg mb-4">Alamat Kami</h3>
                                    {addressDetails.map((detail, index) => (
                                        <div key={index} className="flex items-start gap-4 mb-4">
                                            <detail.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-semibold">{detail.title}</h3>
                                                <p className="text-muted-foreground">{detail.address}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                      </FadeIn>
                      <FadeIn direction="right">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hubungi Kami</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ContactForm />
                            </CardContent>
                        </Card>
                      </FadeIn>
                  </div>
              </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section id="map" className="w-full pb-12 md:pb-24">
            <div className="container mx-auto px-4 md:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lokasi Kantor Kami</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.73277846939!2d106.5558635112086!3d-6.166528393794981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ffff36f2c8bd%3A0xc6f92c681fa0b2bb!2sPT.%20Seido%20Mitra%20Abadi!5e0!3m2!1sen!2sid!4v1754166591800!5m2!1sen!2sid" 
                      width="100%" 
                      height="100%" 
                      style={{ border:0 }} 
                      allowFullScreen={true}
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </FadeIn>

      </main>
      <Footer />
    </div>
  );
}
