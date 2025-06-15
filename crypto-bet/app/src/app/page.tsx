import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/landing/HeroSection';

export default function LandingPage() {
  return (
    <>
      <Header showNavigation={true} layout="landing" />
      <main className="flex flex-col items-center">
        <HeroSection />
      </main>
    </>
  );
} 