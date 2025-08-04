
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { LampContainer } from './ui/lamp';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrls: string[];
  aiHint?: string;
}

export function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .order('createdAt', { ascending: false })
          .limit(4);
        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="portfolio" className="w-full bg-background overflow-hidden">
      <LampContainer>
         <motion.div
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
             className="flex flex-col items-center text-center"
          >
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground mb-4">Portofolio Kami</div>
            <h2 className="text-white py-4 text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Proyek Unggulan Kami
            </h2>
            <p className="max-w-[900px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Berikut adalah beberapa contoh proyek yang menunjukkan keahlian dan kualitas kerja kami. Lihat lebih banyak di halaman portofolio kami.
            </p>
          </motion.div>
      </LampContainer>
      <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-24 lg:pb-32 -mt-24 md:-mt-48 relative z-10">
        {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
          ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project, index) => (
              <Card key={index} className="overflow-hidden group border-2 bg-card/80 backdrop-blur-sm hover:border-primary hover:shadow-lg transition-all duration-300 flex flex-col">
                <CardContent className="p-0 flex-grow flex flex-col">
                  <div className="relative overflow-hidden h-48">
                    <Image
                      src={project.imageUrls[0]}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint={project.aiHint}
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <Badge variant="secondary" className="mb-2 w-fit">{project.category}</Badge>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <CardDescription className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-grow">{project.description}</CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="text-center mt-12">
            <Link href="/portfolio" prefetch={false}>
              <Button>
                Lihat Semua Proyek
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
