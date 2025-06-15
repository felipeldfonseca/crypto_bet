import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { ValuePropSection } from '@/components/landing/ValuePropSection';
import { SpeedSection } from '@/components/landing/SpeedSection';
import { RiskModeSection } from '@/components/landing/RiskModeSection';
import { SwapSection } from '@/components/landing/SwapSection';
import { TransparencySection } from '@/components/landing/TransparencySection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <Header showNavigation={true} layout="landing" />
      <main className="flex flex-col items-center">
        <HeroSection />
        <ValuePropSection />
        <SpeedSection />
        <RiskModeSection />
        <SwapSection />
        <TransparencySection />
        <SecuritySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
} 