'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export function ContactSection() {
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
      
      toast.success('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Gagal mengirim pesan. Silakan coba lagi nanti.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Hubungi Kami</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Ada pertanyaan atau ingin mendiskusikan proyek Anda? Isi formulir di bawah ini.
          </p>
        </div>
        <div className="mx-auto w-full max-w-lg">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="name">Nama</Label>
                    <Input id="name" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="subject">Subjek</Label>
                  <Input id="subject" placeholder="Diskusi Proyek Conveyor" required value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea id="message" placeholder="Tuliskan pesan Anda di sini..." required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Pesan'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
