import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/landing/HeroSection';

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center">
        <HeroSection />
      </main>
    </>
  );
} 