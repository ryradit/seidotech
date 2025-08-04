
import * as React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Facebook } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const contactNumbers = [
    { number: '0817307887' },
    { number: '08119057887' }
  ];

  const adminNumber = '081219351100';

  const WhatsAppLink = ({ number, children }: { number: string; children: React.ReactNode }) => {
    const cleanNumber = number.startsWith('0') ? '62' + number.substring(1) : number;
    const message = encodeURIComponent('Halo, saya ingin bertanya tentang layanan Seido.');
    return (
        <a 
        href={`https://wa.me/${cleanNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary transition-colors"
        >
        {children}
        </a>
    );
  };

  return (
    <footer style={{ backgroundColor: '#1e293b' }} className="text-gray-300">
      <div className="container mx-auto px-4 md:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <Image src="/seidoiconwhite.png" alt="Seido Logo" width={128} height={128} className="h-16 w-40" />
          </Link>
          <p className="text-sm text-gray-400">
            Partner Manufaktur & Engineering Terpercaya Anda.
          </p>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Twitter" className="text-gray-400 hover:text-primary"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Facebook" className="text-gray-400 hover:text-primary"><Facebook className="h-5 w-5" /></Link>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Navigasi</h4>
          <nav className="grid gap-2">
            <Link href="/tentang-kami" className="text-gray-400 hover:text-primary" prefetch={false}>Tentang Kami</Link>
            <Link href="/layanan" className="text-gray-400 hover:text-primary" prefetch={false}>Layanan</Link>
            <Link href="/portfolio" className="text-gray-400 hover:text-primary" prefetch={false}>Portofolio</Link>
            <Link href="/kontak" className="text-gray-400 hover:text-primary" prefetch={false}>Kontak</Link>
          </nav>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Info Kontak</h4>
          <address className="not-italic space-y-2 text-gray-400 text-sm">
            <p>
              <strong>Telp:</strong>{' '}
              {contactNumbers.map((contact, index) => (
                <React.Fragment key={contact.number}>
                  <WhatsAppLink number={contact.number}>{contact.number}</WhatsAppLink>
                  {index < contactNumbers.length - 1 && ' / '}
                </React.Fragment>
              ))}
            </p>
            <p><strong>Admin:</strong> <WhatsAppLink number={adminNumber}>{adminNumber}</WhatsAppLink></p>
            <div><strong>Email:</strong> <div><a href="mailto:ptseido@gmail.com" className="hover:text-primary">ptseido@gmail.com</a></div> <div><a href="mailto:info@seido.co.id" className="hover:text-primary">info@seido.co.id</a></div></div>
            <p><strong>Office:</strong> Ruko Bumi Indah Tahap 1 Blok RB 10, Pasar Kemis, Tangerang</p>
          </address>
        </div>
      </div>
      <div className="border-t border-slate-700">
        <div className="container mx-auto px-4 md:px-6 py-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} PT. Seido Mitra Abadi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
