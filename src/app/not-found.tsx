'use client';

import { Button } from '../components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-slate-50/10 dark:from-background dark:to-slate-900/5 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image 
            src="/seidoicon.png"
            alt="Seido Logo"
            width={120}
            height={120}
            className="h-24 w-auto"
            priority
          />
        </div>
        
        {/* Animated Error Code */}
        <motion.h1 
          className="text-8xl font-bold text-primary"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          404
        </motion.h1>
        
        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-foreground">Halaman Tidak Ditemukan</h2>
          <p className="text-muted-foreground text-lg">
            Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
          </p>
        </div>
        
        {/* Decorative Element */}
        <div className="relative h-2 w-36 mx-auto my-6">
          <div className="absolute inset-0 bg-primary/30 rounded-full"></div>
          <motion.div 
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          ></motion.div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/">
            <Button className="gap-2 group w-full sm:w-auto">
              <Home className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="gap-2 group w-full sm:w-auto border-primary/50 hover:bg-primary/10 hover:text-primary hover:border-primary"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 text-primary group-hover:-translate-x-1 transition-transform" />
            Kembali ke Halaman Sebelumnya
          </Button>
        </div>
      </div>
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
