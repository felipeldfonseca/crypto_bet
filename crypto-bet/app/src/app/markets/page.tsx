'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketCreationForm, MarketData } from '@/components/markets/MarketCreationForm';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { TokenSwap } from '@/components/shared/TokenSwap';
import { Plus, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function MarketsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);

  const handleCreateMarket = async (marketData: MarketData) => {
    console.log('Creating market:', marketData);
    // TODO: Implement actual market creation logic with smart contract
    alert('Market creation functionality will be implemented with smart contract integration!');
    setShowCreateForm(false);
  };

  // Mock market data for demonstration
  const mockMarkets = [
    {
      id: '1',
      title: 'Will Bitcoin reach $100,000 by end of 2024?',
      category: 'crypto',
      totalPool: 15.5,
      participants: 23,
      endDate: '2024-12-31',
      yesOdds: 2.3,
      noOdds: 1.7
    },
    {
      id: '2',
      title: 'Will Ethereum merge to Proof of Stake be successful?',
      category: 'crypto',
      totalPool: 8.2,
      participants: 15,
      endDate: '2024-06-30',
      yesOdds: 1.4,
      noOdds: 2.9
    },
    {
      id: '3',
      title: 'Will Solana price exceed $200 in 2024?',
      category: 'crypto',
      totalPool: 12.1,
      participants: 31,
      endDate: '2024-11-15',
      yesOdds: 3.1,
      noOdds: 1.3
    }
  ];

  return (
    <section className="w-full pt-12 pb-24">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Prediction Markets
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Create and participate in decentralized prediction markets on Solana.
          </p>
          
          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <ModeToggle size="lg" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Market
          </Button>
          
          <Button 
            onClick={() => setShowSwapModal(!showSwapModal)}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-5 w-5" />
            Token Swap
          </Button>
        </div>

        {/* Market Creation Form */}
        {showCreateForm && (
          <div className="mb-12">
            <MarketCreationForm 
              onSubmit={handleCreateMarket}
              className="mb-8"
            />
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Token Swap Modal */}
        {showSwapModal && (
          <div className="mb-12">
            <TokenSwap 
              onSwapComplete={(signature) => {
                console.log('Swap completed:', signature);
                setShowSwapModal(false);
              }}
              onError={(error) => {
                console.error('Swap error:', error);
              }}
            />
            <div className="text-center mt-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowSwapModal(false)}
              >
                Close Swap
              </Button>
            </div>
          </div>
        )}

        {/* Markets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMarkets.map((market) => (
            <Card key={market.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="mb-2">
                    {market.category}
                  </Badge>
                  <div className="text-right text-sm text-muted-foreground">
                    Ends: {new Date(market.endDate).toLocaleDateString()}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {market.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Market Stats */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{market.totalPool} SOL</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>{market.participants} traders</span>
                  </div>
                </div>

                {/* Odds */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="flex flex-col p-3 h-auto">
                    <span className="text-xs text-muted-foreground">YES</span>
                    <span className="font-bold text-green-600">{market.yesOdds}x</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col p-3 h-auto">
                    <span className="text-xs text-muted-foreground">NO</span>
                    <span className="font-bold text-red-600">{market.noOdds}x</span>
                  </Button>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full" 
                  onClick={() => {
                    // TODO: Implement bet placement
                    alert('Betting functionality will be implemented with smart contract integration!');
                  }}
                >
                  Place Bet
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockMarkets.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No markets yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to create a prediction market!
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              Create First Market
            </Button>
          </div>
        )}
      </div>
    </section>
  );
} 