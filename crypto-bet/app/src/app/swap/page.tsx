'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenSwap } from '@/components/shared/TokenSwap';
import { ModeToggle, ModeInfoCard } from '@/components/shared/ModeToggle';
import { Badge } from '@/components/ui/badge';
import { useBettingMode } from '@/components/providers/BettingModeProvider';
import { ArrowUpDown, Zap, Shield, DollarSign, TrendingUp } from 'lucide-react';

export default function SwapPage() {
  const { getModeConfig, preferredToken } = useBettingMode();
  const modeConfig = getModeConfig();

  const handleSwapComplete = (signature: string) => {
    console.log('Swap completed:', signature);
    // TODO: Add success notification/toast
  };

  const handleSwapError = (error: string) => {
    console.error('Swap error:', error);
    // TODO: Add error notification/toast
  };

  return (
    <section className="w-full pt-12 pb-24 min-h-screen">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ArrowUpDown className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Token Swap
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Convert between SOL and USDC instantly with the best rates on Solana.
            Powered by Jupiter aggregation technology.
          </p>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <ModeToggle size="lg" />
          </div>

          {/* Current Mode Badge */}
          <Badge 
            variant="outline" 
            className={`${modeConfig.color} ${modeConfig.bgColor} px-4 py-2`}
          >
            <span className="mr-2">{modeConfig.icon}</span>
            Currently in {modeConfig.name} - Swapping to {preferredToken}
          </Badge>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Swap Interface */}
          <div className="lg:col-span-2">
            <TokenSwap 
              onSwapComplete={handleSwapComplete}
              onError={handleSwapError}
              className="max-w-none"
            />
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Mode Information */}
            <ModeInfoCard />

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
} 