
'use client';
import './portfolio.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Loader2, 
  Maximize2, 
  Grid3X3, 
  List, 
  Eye,
  Calendar,
  MapPin,
  X
} from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrls: string[];
  aiHint?: string;
  createdAt?: string;
}

interface Mitra {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

const ProjectCard = ({ title, category, description, imageUrls, aiHint, onViewDetails }: { 
  title: string, 
  category: string, 
  description: string, 
  imageUrls: string[], 
  aiHint?: string,
  onViewDetails: () => void 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Ensure imageUrls is an array and has valid URLs
  let validImageUrls: string[] = [];
  
  if (Array.isArray(imageUrls)) {
    validImageUrls = imageUrls.filter(url => {
      if (!url || typeof url !== 'string') return false;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });
  }
  
  const imageSrc = validImageUrls.length > 0 ? validImageUrls[0] : 'https://placehold.co/600x400.png';
  
  return (
    <Card 
      className="overflow-hidden group border-0 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all duration-500 flex flex-col hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 project-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="relative overflow-hidden h-56 bg-gradient-to-br from-primary/5 to-secondary/5">
          <Image
            src={imageSrc}
            alt={title}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            data-ai-hint={aiHint || 'project image'}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute bottom-4 left-4 right-4 transform transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Button 
              size="sm" 
              variant="secondary" 
              className="backdrop-blur-md bg-white/20 hover:bg-white/30 text-white border-white/20"
              onClick={onViewDetails}
            >
              <Eye className="h-4 w-4 mr-2" />
              Lihat Detail
            </Button>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors badge-hover">
              {category}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              2024
            </div>
          </div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <CardDescription className="text-sm flex-grow line-clamp-3 leading-relaxed">
            {description}
          </CardDescription>
          <div className="flex items-center text-xs text-muted-foreground pt-2">
            <MapPin className="h-3 w-3 mr-1" />
            Indonesia
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [mitras, setMitras] = useState<Mitra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Get unique categories from projects
  const categories = ['Semua', ...Array.from(new Set(projects.map(p => p.category)))];

  // Handle project detail view
  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setZoomedImage(null);
  };

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1500; // 1.5 seconds between retries
    
    const fetchData = async (retry = 0) => {
      if (!loading && retry > 0) setLoading(true);
      
      try {
        // Clear any previous errors when attempting a new fetch
        if (error) setError(null);
        
        console.log('Fetching portfolio data...');
        
        // Fetch projects with timeout handling
        const projectsPromise = supabase
          .from('portfolios')
          .select('*')
          .order('createdAt', { ascending: false });
          
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Fetch timeout')), 10000)
        );
        
        // Race between fetch and timeout
        const { data: projectsData, error: projectsError } = await Promise.race([
          projectsPromise,
          timeoutPromise.then(() => {
            throw new Error('Fetch timeout');
          })
        ]) as any;
        
        if (projectsError) {
          console.error('Projects fetch error:', projectsError);
          throw projectsError;
        }
        
        // If we reached here, project data was successfully fetched
        console.log(`Fetched ${projectsData?.length || 0} projects successfully`);
        
        // Fetch mitras (don't throw on error since mitras table might not exist yet)
        const { data: mitrasData, error: mitrasError } = await supabase
          .from('mitras')
          .select('*')
          .order('createdAt', { ascending: false });
        
        if (mitrasError) {
          console.warn('Mitras fetch error (continuing without mitra data):', mitrasError);
        }
        
        // Only update state if we have data and component is still mounted
        if (projectsData) {
          setProjects(projectsData);
          setFilteredProjects(
            selectedCategory === 'Semua' 
              ? projectsData 
              : projectsData.filter((project: Project) => project.category === selectedCategory)
          );
          setMitras(mitrasData || []);
        }
        
        retryCount = 0; // Reset retry counter on success
      } catch (err) {
        console.error(`Error fetching data (attempt ${retry + 1}):`, err);
        
        // Retry logic
        if (retry < maxRetries) {
          console.log(`Retrying in ${retryDelay}ms... (${retry + 1}/${maxRetries})`);
          retryCount++;
          // Use setTimeout to prevent immediate retry
          setTimeout(() => fetchData(retry + 1), retryDelay);
          return; // Exit current attempt
        } else {
          console.error('Max retries reached, giving up.');
          // Set error message for UI
          const errorMessage = err instanceof Error ? err.message : 'Gagal memuat data portfolio';
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up real-time subscription for portfolios table
    const portfolioSubscription = supabase
      .channel('portfolio_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'portfolios' }, 
        (payload) => {
          console.log('Received real-time update for portfolios', payload);
          // Refresh data when changes occur
          fetchData();
        }
      )
      .subscribe();
      
    // Set up real-time subscription for mitras table  
    const mitraSubscription = supabase
      .channel('mitra_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'mitras' }, 
        (payload) => {
          console.log('Received real-time update for mitras', payload);
          // Refresh data when changes occur
          fetchData();
        }
      )
      .subscribe();
      
    // Clean up subscriptions
    return () => {
      portfolioSubscription.unsubscribe();
      mitraSubscription.unsubscribe();
    };
  }, [selectedCategory]);

  // Filter projects based on category
  useEffect(() => {
    let filtered = projects;
    
    if (selectedCategory !== 'Semua') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }
    
    setFilteredProjects(filtered);
  }, [projects, selectedCategory]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with enhanced design */}
        <FadeIn direction="down">
          <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
            <div className="container relative mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="inline-flex items-center rounded-full bg-primary/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-primary border border-primary/20">
                  <Building className="h-4 w-4 mr-2" />
                  Portofolio Kami
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl font-headline bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Proyek & Kemitraan
                </h1>
                <p className="max-w-3xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                  Menampilkan keahlian kami melalui proyek yang telah selesai dan daftar klien 
                  yang telah mempercayai kami dalam berbagai industri.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <Badge variant="outline" className="text-sm">
                    {filteredProjects.length} Proyek Ditampilkan
                  </Badge>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Filter Section */}
        <FadeIn>
          <section className="w-full pb-8">
            <div className="container mx-auto px-4 md:px-6">
              <Card className="bg-card/40 backdrop-blur-sm border-border/50 mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="flex gap-2 flex-wrap">
                        {categories.map((category) => (
                          <Button
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className="text-xs"
                          >
                            {category}
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {category === 'Semua' 
                                ? projects.length 
                                : projects.filter(p => p.category === category).length
                              }
                            </Badge>
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </FadeIn>

            {/* Projects Section with enhanced layout */}
            <FadeIn>
              <section className="w-full pb-20 md:pb-32">
                <div className="container mx-auto px-4 md:px-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
                        Proyek Unggulan
                      </h2>
                      <p className="text-muted-foreground">
                        {selectedCategory !== 'Semua' ? `Kategori: ${selectedCategory}` : 'Semua kategori'} 
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <div className="relative">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">Memuat proyek...</p>
                      <p className="text-xs text-muted-foreground opacity-70">Mohon tunggu sebentar</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <div className="text-6xl opacity-20">!</div>
                      <h3 className="text-xl font-semibold">Gagal memuat data</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        Terjadi masalah saat memuat data. Silakan coba lagi.
                      </p>
                      <Button 
                        variant="default" 
                        className="mt-2"
                        onClick={() => {
                          setLoading(true);
                          setError(null);
                          // Fetch data with a slight delay to show loading state
                          setTimeout(() => {
                            const fetchData = async () => {
                              try {
                                const { data, error } = await supabase
                                  .from('portfolios')
                                  .select('*')
                                  .order('createdAt', { ascending: false });
                                
                                if (error) throw error;
                                setProjects(data || []);
                                setFilteredProjects(
                                  selectedCategory === 'Semua' 
                                    ? data || []
                                    : (data || []).filter((project: Project) => project.category === selectedCategory)
                                );
                              } catch (err) {
                                setError('Gagal memuat data portfolio');
                              } finally {
                                setLoading(false);
                              }
                            };
                            fetchData();
                          }, 500);
                        }}
                      >
                        Coba Lagi
                      </Button>
                    </div>
                  ) : filteredProjects.length > 0 ? (
                    <div className={
                      viewMode === 'grid' 
                        ? "grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                        : "space-y-6"
                    }>
                      {filteredProjects.map((project, index) => (
                        <FadeIn key={project.id} delay={index * 0.1}>
                          <ProjectCard 
                            title={project.title}
                            category={project.category}
                            description={project.description}
                            imageUrls={project.imageUrls}
                            aiHint={project.aiHint}
                            onViewDetails={() => handleViewDetails(project)}
                          />
                        </FadeIn>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <div className="text-6xl opacity-20">�</div>
                      <h3 className="text-xl font-semibold">Tidak ada proyek ditemukan</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        {selectedCategory !== 'Semua' 
                          ? 'Coba ubah filter kategori Anda.'
                          : 'Belum ada proyek portofolio yang ditambahkan.'
                        }
                      </p>
                      {selectedCategory !== 'Semua' && (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedCategory('Semua');
                          }}
                        >
                          Reset Filter
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </FadeIn>

            {/* Partners Section with enhanced design */}
            <FadeIn>
              <section className="w-full pb-20 md:pb-32 bg-gradient-to-r from-secondary/20 via-background to-primary/5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-50">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z' fill='%23000000' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`
                  }} />
                </div>
                <div className="container relative mx-auto px-4 md:px-6">
                  <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
                    <div className="inline-flex items-center rounded-full bg-primary/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-primary border border-primary/20">
                      <Building className="h-4 w-4 mr-2" />
                      Mitra Terpercaya
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                      Klien & Mitra Kami
                    </h2>
                    <p className="max-w-3xl text-lg text-muted-foreground leading-relaxed">
                      Kami bangga telah bekerja sama dengan berbagai perusahaan terkemuka di berbagai industri 
                      dan membangun kepercayaan jangka panjang.
                    </p>
                  </div>
                  <Card className="bg-card/40 backdrop-blur-sm border-border/50">
                    <CardContent className="p-8 md:p-12">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mitras.map((mitra, index) => (
                          <FadeIn key={mitra.id} delay={index * 0.05}>
                            <li className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-all duration-300 group">
                              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Building className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <span className="text-foreground font-medium group-hover:text-primary transition-colors block">
                                  {mitra.name}
                                </span>
                                {mitra.description && (
                                  <span className="text-xs text-muted-foreground mt-1 block">
                                    {mitra.description}
                                  </span>
                                )}
                              </div>
                            </li>
                          </FadeIn>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </FadeIn>
          </main>
          
          <Footer />

          {/* Project Detail Modal */}
          {isModalOpen && selectedProject && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-background rounded-lg shadow-2xl flex flex-col">
                <div className="sticky top-0 z-30 flex items-center justify-between p-6 border-b bg-background/95 backdrop-blur-sm">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedProject.title}</h2>
                    <Badge variant="secondary" className="mt-2">
                      {selectedProject.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseModal}
                    className="hover:bg-accent"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                  {/* Project Images */}
                  {selectedProject.imageUrls && selectedProject.imageUrls.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">Gambar Proyek</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedProject.imageUrls.filter(url => {
                          try {
                            new URL(url);
                            return true;
                          } catch {
                            return false;
                          }
                        }).map((imageUrl, index) => (
                          <div 
                            key={index} 
                            className="relative overflow-hidden rounded-lg cursor-pointer group"
                            onClick={() => setZoomedImage(imageUrl)}
                          >
                            <Image
                              src={imageUrl}
                              alt={`${selectedProject.title} - Image ${index + 1}`}
                              width={600}
                              height={400}
                              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                                <Maximize2 className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Project Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Deskripsi Proyek</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>
                  
                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Kategori
                      </h4>
                      <p className="text-muted-foreground">{selectedProject.category}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Lokasi
                      </h4>
                      <p className="text-muted-foreground">Indonesia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Image Zoom Modal */}
          {zoomedImage && (
            <div 
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setZoomedImage(null)}
            >
              <div 
                className="relative max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setZoomedImage(null)}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white z-10"
                >
                  <X className="h-5 w-5" />
                </Button>
                <Image
                  src={zoomedImage}
                  alt="Zoomed project image"
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
              </div>
            </div>
          )}
    </div>
  );
}
