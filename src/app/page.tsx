
import { Header } from '../components/header';
import { HeroSection } from '../components/hero-section';
import { AboutSection } from '../components/about-section';
import { ServicesSection } from '../components/services-section';
import { PortfolioSection } from '../components/portfolio-section';
import { MitraSection } from '../components/mitra-section';
import { ContactSection } from '../components/contact-section';
import { Footer } from '../components/footer';
import { FadeIn } from '../components/ui/fade-in';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <FadeIn direction="down">
          <HeroSection />
        </FadeIn>
        <FadeIn>
          <MitraSection />
        </FadeIn>
        <FadeIn direction="right">
          <AboutSection />
        </FadeIn>
        <FadeIn>
          <ServicesSection />
        </FadeIn>
        <FadeIn>
          <PortfolioSection />
        </FadeIn>
        <FadeIn>
          <ContactSection />
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
}
