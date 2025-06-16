import React from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { ValuePropSection } from '@/components/landing/ValuePropSection';
import { SpeedSection } from '@/components/landing/SpeedSection';
import { RiskModeSection } from '@/components/landing/RiskModeSection';
import { SwapSection } from '@/components/landing/SwapSection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { TransparencySection } from '@/components/landing/TransparencySection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

// Memoized sections container to prevent unnecessary re-renders
const LandingSections = React.memo(function LandingSections() {
  return (
    <>
      <HeroSection />
      <ValuePropSection />
      <SpeedSection />
      <RiskModeSection />
      <SwapSection />
      <SecuritySection />
      <TransparencySection />
      <CTASection />
      <Footer />
    </>
  );
});

export default React.memo(function LandingPage() {
  return (
    <main className="min-h-screen">
      <LandingSections />
    </main>
  );
}); 