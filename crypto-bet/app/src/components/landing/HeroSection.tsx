"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="w-full pt-12 pb-24">
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

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link href="/markets">
            <Button size="lg" className="rounded-full flex items-center gap-2">
              Explore Markets
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}; 