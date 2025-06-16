'use client';

import React, { useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenSwap } from '@/components/shared/TokenSwap';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { useBettingMode } from '@/components/providers/BettingModeProvider';
import { ArrowUpDown, Zap, Shield, DollarSign, TrendingUp, ArrowLeftRight } from 'lucide-react';

// Memoized feature card component
const FeatureCard = React.memo<{
  icon: React.ReactNode;
  title: string;
  description: string;
}>(function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center p-6 rounded-lg border bg-card">
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-primary/10">
          {icon}
        </div>
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
});

// Memoized features section
const FeaturesSection = React.memo(function FeaturesSection() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <FeatureCard
        icon={<Zap className="h-6 w-6 text-primary" />}
        title="Lightning Fast"
        description="Powered by Jupiter aggregator for best rates and minimal slippage"
      />
      <FeatureCard
        icon={<Shield className="h-6 w-6 text-primary" />}
        title="Secure & Trustless"
        description="Non-custodial swaps directly from your wallet"
      />
      <FeatureCard
        icon={<ArrowLeftRight className="h-6 w-6 text-primary" />}
        title="Best Rates"
        description="Automatically finds the best price across all DEXs"
      />
    </div>
  );
});

export default React.memo(function SwapPage() {
  const theme = useTheme();
  const { getModeConfig } = useBettingMode();
  const config = getModeConfig();

  // Memoized event handlers
  const handleSwapComplete = useCallback((signature: string) => {
    // Success notification would be handled by the TokenSwap component
    // Signature is logged securely within the component
  }, []);

  const handleSwapError = useCallback((error: string) => {
    // Error notification would be handled by the TokenSwap component
    // Error is logged securely within the component
  }, []);

  // Memoized page title
  const pageTitle = useMemo(() => 
    `Token Swap - ${config.name} Mode`, 
    [config.name]
  );

  return (
    <section className="w-full pt-12 pb-24 min-h-screen">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ArrowUpDown className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              {pageTitle}
            </h1>
          </div>
          
          <p className={`text-lg max-w-2xl mx-auto mb-6 ${theme.isDramatic ? theme.textSecondary : 'text-muted-foreground'}`}>
            Exchange tokens instantly with the best rates on Solana
          </p>

          {/* Mode Toggle */}
          <div className="flex justify-center">
            <ModeToggle showInfo={true} />
          </div>
        </div>

        {/* Features */}
        <FeaturesSection />

        {/* Main Swap Interface */}
        <div className="max-w-md mx-auto mb-12">
          <TokenSwap 
            onSwapComplete={handleSwapComplete}
            onError={handleSwapError}
          />
        </div>

        {/* Feature Cards Below Swap */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {/* Swap Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                Why Swap Here?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Best Rates</p>
                  <p className="text-xs text-muted-foreground">
                    Jupiter aggregation finds optimal routes
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Secure Swaps</p>
                  <p className="text-xs text-muted-foreground">
                    Non-custodial, direct wallet transactions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Low Fees</p>
                  <p className="text-xs text-muted-foreground">
                    Minimal slippage, competitive spreads
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Volume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">SOL/USDC</span>
                <span className="font-medium">$2.4M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Swaps</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg. Slippage</span>
                <span className="font-medium text-green-600">0.12%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">How Swapping Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold mb-2">Connect Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your Solana wallet (Phantom, Solflare, etc.)
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold mb-2">Choose Amount</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the amount you want to swap and review the quote
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold mb-2">Execute Swap</h3>
                <p className="text-sm text-muted-foreground">
                  Confirm the transaction and receive your tokens instantly
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Jupiter Integration Notice */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <img 
                  src="https://jup.ag/svg/jupiter-logo.svg" 
                  alt="Jupiter" 
                  className="w-6 h-6"
                />
                <span className="font-semibold">Powered by Jupiter</span>
              </div>
              <p className="text-sm text-muted-foreground">
                We use Jupiter's aggregation technology to find the best swap routes across 
                all Solana DEXes, ensuring you get the optimal price for every trade.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}); 