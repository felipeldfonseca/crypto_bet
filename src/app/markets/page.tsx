'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketCreationForm, MarketData } from '@/components/markets/MarketCreationForm';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { TokenSwap } from '@/components/shared/TokenSwap';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Plus, TrendingUp, Users, DollarSign, ArrowLeftRight } from 'lucide-react';
import { useBettingMode } from '@/components/providers/BettingModeProvider';

// Memoized modal component
const Modal = React.memo<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}>(function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
});

// Memoized empty state component
const EmptyMarketsState = React.memo(function EmptyMarketsState() {
  const { getModeConfig } = useBettingMode();
  const config = getModeConfig();

  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">{config.icon}</div>
      <h3 className="text-2xl font-bold mb-2">No Markets Yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Be the first to create a prediction market in {config.name} mode. 
        Set the odds and let others bet on the outcome.
      </p>
    </div>
  );
});

// Memoized action buttons component
const ActionButtons = React.memo<{
  onCreateMarket: () => void;
  onOpenSwap: () => void;
}>(function ActionButtons({ onCreateMarket, onOpenSwap }) {
  return (
    <div className="flex gap-4">
      <Button onClick={onCreateMarket} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Create Market
      </Button>
      <Button variant="outline" onClick={onOpenSwap} className="flex items-center gap-2">
        <ArrowLeftRight className="h-4 w-4" />
        Token Swap
      </Button>
    </div>
  );
});

export default React.memo(function MarketsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const theme = useTheme();
  const { getModeConfig } = useBettingMode();
  const config = getModeConfig();

  // Memoized event handlers
  const handleCreateMarket = useCallback(async (marketData: MarketData) => {
    console.log('Creating market:', marketData);
    // TODO: Implement actual market creation logic with smart contract
    alert('Market creation functionality will be implemented with smart contract integration!');
    setShowCreateForm(false);
  }, []);

  const handleCloseCreateForm = useCallback(() => {
    setShowCreateForm(false);
  }, []);

  const handleOpenSwap = useCallback(() => {
    setShowSwapModal(true);
  }, []);

  const handleCloseSwap = useCallback(() => {
    setShowSwapModal(false);
  }, []);

  const handleSwapComplete = useCallback((signature: string) => {
    console.log('Swap completed:', signature);
    setShowSwapModal(false);
  }, []);

  const handleSwapError = useCallback((error: string) => {
    console.error('Swap error:', error);
  }, []);

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

  // Memoized page title
  const pageTitle = useMemo(() => 
    `${config.name} Markets`, 
    [config.name]
  );

  return (
    <section className="w-full pt-12 pb-24">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {pageTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Create and participate in decentralized prediction markets on Solana.
          </p>
          
          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <ModeToggle showInfo={true} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <ActionButtons 
            onCreateMarket={() => setShowCreateForm(true)}
            onOpenSwap={() => setShowSwapModal(true)}
          />
        </div>

        {/* Market Creation Form */}
        <Modal
          isOpen={showCreateForm}
          onClose={handleCloseCreateForm}
          title="Create New Market"
        >
          <MarketCreationForm 
            onSubmit={handleCreateMarket}
            className="mb-8"
          />
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={handleCloseCreateForm}
            >
              Cancel
            </Button>
          </div>
        </Modal>

        {/* Token Swap Modal */}
        <Modal
          isOpen={showSwapModal}
          onClose={handleCloseSwap}
          title="Token Swap"
        >
          <TokenSwap 
            onSwapComplete={handleSwapComplete}
            onError={handleSwapError}
          />
          <div className="text-center mt-4">
            <Button 
              variant="ghost" 
              onClick={handleCloseSwap}
            >
              Close Swap
            </Button>
          </div>
        </Modal>

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
          <EmptyMarketsState />
        )}
      </div>
    </section>
  );
}); 