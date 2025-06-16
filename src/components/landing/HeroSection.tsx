"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Memoized button components to prevent recreation
const ExploreMarketsButton = React.memo(function ExploreMarketsButton() {
  return (
    <Link href="/markets">
      <Button size="lg" className="rounded-full flex items-center gap-2">
        Explore Markets
        <ArrowRight className="h-4 w-4" />
      </Button>
    </Link>
  );
});

const TokenSwapButton = React.memo(function TokenSwapButton() {
  return (
    <Link href="/swap">
      <Button variant="outline" size="lg" className="rounded-full">
        Try Token Swap Demo
      </Button>
    </Link>
  );
});

export const HeroSection = React.memo(function HeroSection() {
  return (
    <section className="w-full pt-12 pb-16">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 leading-tight">
          Fast. <br className="hidden lg:block" />
          On-Chain. <br className="hidden lg:block" />
          Crypto&nbsp;Betting.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Decimal odds, classic bet-slip and real-time market stats — built for speed on Solana.
        </p>

        {/* Primary CTA Button */}
        <div className="flex justify-center mb-8">
          <ExploreMarketsButton />
        </div>

        {/* Secondary CTA */}
        <div className="text-center">
          <TokenSwapButton />
        </div>
      </div>
    </section>
  );
}); 