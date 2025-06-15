"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Coins, TrendingUp, Shield, Zap } from 'lucide-react';
import { ModeToggle, ModeInfoCard } from '@/components/shared/ModeToggle';
import { TokenSwap } from '@/components/shared/TokenSwap';

export const HeroSection: React.FC = () => {
  const [showSwapDemo, setShowSwapDemo] = useState(false);

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

        {/* Mode Selection */}
        <div className="flex justify-center mb-8">
          <ModeToggle size="lg" />
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 mx-auto mb-4 text-orange-500" />
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Sub-second transactions on Solana
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Coins className="h-8 w-8 mx-auto mb-4 text-blue-500" />
              <h3 className="font-semibold mb-2">Dual Token Support</h3>
              <p className="text-sm text-muted-foreground">
                Bet with SOL or USDC seamlessly
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">Real-time Odds</h3>
              <p className="text-sm text-muted-foreground">
                Live market data and pricing
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 mx-auto mb-4 text-purple-500" />
              <h3 className="font-semibold mb-2">Secure & Audited</h3>
              <p className="text-sm text-muted-foreground">
                Smart contracts you can trust
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mode Information */}
        <div className="max-w-md mx-auto mb-8">
          <ModeInfoCard />
        </div>

        {/* Swap Demo */}
        <div className="text-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => setShowSwapDemo(!showSwapDemo)}
            className="mb-4"
          >
            {showSwapDemo ? 'Hide' : 'Try'} Token Swap Demo
          </Button>
          
          {showSwapDemo && (
            <div className="max-w-md mx-auto">
              <TokenSwap 
                onSwapComplete={(signature) => {
                  console.log('Swap completed:', signature);
                  // You can add a success toast here
                }}
                onError={(error) => {
                  console.error('Swap error:', error);
                  // You can add an error toast here
                }}
              />
            </div>
          )}
        </div>

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