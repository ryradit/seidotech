import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export function BlogHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center mb-2">
          <Link 
            href="/" 
            className="text-white/80 hover:text-white flex items-center text-sm font-medium"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Kembali ke Beranda
          </Link>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Blog Seido Tech</h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl">
          Temukan artikel terbaru seputar teknologi industri, sistem conveyor, dan best practices dalam manufaktur modern.
        </p>
      </div>
    </div>
  );
}
