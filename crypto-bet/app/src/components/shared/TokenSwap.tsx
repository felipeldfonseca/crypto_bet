'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  executeSwap, 
  getSwapQuote, 
  formatTokenAmount, 
  getTokenPrice,
  TOKENS,
  TokenType,
  SwapQuote,
  SwapRequest
} from '@/lib/jupiter';
import { ArrowUpDown, Settings, RefreshCw } from 'lucide-react';

interface TokenSwapProps {
  className?: string;
  fromToken?: TokenType;
  toToken?: TokenType;
  onSwapComplete?: (signature: string) => void;
  onError?: (error: string) => void;
}

export function TokenSwap({
  className,
  fromToken = 'SOL',
  toToken = 'USDC',
  onSwapComplete,
  onError
}: TokenSwapProps) {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [amount, setAmount] = useState<string>('');
  const [fromTokenType, setFromTokenType] = useState<TokenType>(fromToken);
  const [toTokenType, setToTokenType] = useState<TokenType>(toToken);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [slippage, setSlippage] = useState(50); // 0.5%
  const [priceImpact, setPriceImpact] = useState<string>('0');
  const [fromTokenPrice, setFromTokenPrice] = useState<number>(0);
  const [toTokenPrice, setToTokenPrice] = useState<number>(0);

  // Get real-time quote
  const fetchQuote = useCallback(async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setQuote(null);
      return;
    }

    setLoading(true);
    try {
      const amountInBaseUnits = fromTokenType === 'SOL' 
        ? Math.floor(parseFloat(amount) * 1e9)
        : Math.floor(parseFloat(amount) * 1e6);

      const quoteResponse = await getSwapQuote(
        TOKENS[fromTokenType],
        TOKENS[toTokenType],
        amountInBaseUnits,
        slippage
      );

      setQuote(quoteResponse);
      setPriceImpact(quoteResponse.priceImpactPct);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [amount, fromTokenType, toTokenType, slippage]);

  // Fetch token prices
  const fetchPrices = useCallback(async () => {
    try {
      const [fromPrice, toPrice] = await Promise.all([
        getTokenPrice(TOKENS[fromTokenType]),
        getTokenPrice(TOKENS[toTokenType])
      ]);
      setFromTokenPrice(fromPrice);
      setToTokenPrice(toPrice);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    }
  }, [fromTokenType, toTokenType]);

  // Auto-refresh quote every 10 seconds
  useEffect(() => {
    fetchQuote();
    const interval = setInterval(fetchQuote, 10000);
    return () => clearInterval(interval);
  }, [fetchQuote]);

  // Fetch prices on token change
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const handleSwap = async () => {
    if (!connected || !publicKey || !signTransaction || !quote) {
      onError?.('Wallet not connected or quote unavailable');
      return;
    }

    setSwapping(true);
    try {
      const amountInBaseUnits = fromTokenType === 'SOL' 
        ? Math.floor(parseFloat(amount) * 1e9)
        : Math.floor(parseFloat(amount) * 1e6);

      const swapRequest: SwapRequest = {
        fromToken: fromTokenType,
        toToken: toTokenType,
        amount: amountInBaseUnits,
        slippageBps: slippage,
        userPublicKey: publicKey.toString()
      };

      const signature = await executeSwap(connection, swapRequest, signTransaction);
      onSwapComplete?.(signature);
      
      // Reset form
      setAmount('');
      setQuote(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Swap failed';
      onError?.(errorMessage);
    } finally {
      setSwapping(false);
    }
  };

  const handleFlipTokens = () => {
    setFromTokenType(toTokenType);
    setToTokenType(fromTokenType);
    setAmount('');
    setQuote(null);
  };

  const getOutputAmount = () => {
    if (!quote) return '0';
    const decimals = toTokenType === 'SOL' ? 9 : 6;
    const outputAmount = parseInt(quote.outAmount) / Math.pow(10, decimals);
    return formatTokenAmount(outputAmount);
  };

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Token Swap</span>
          <Button variant="ghost" size="sm" onClick={fetchQuote} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* From Token Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">From</span>
            <span className="text-muted-foreground">
              Price: ${formatTokenAmount(fromTokenPrice, 2)}
            </span>
          </div>
          <div className="flex gap-2">
                         <Input
               type="number"
               placeholder="0.00"
               value={amount}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
               className="flex-1"
             />
            <Badge variant="outline" className="px-3 py-2 font-medium">
              {fromTokenType}
            </Badge>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFlipTokens}
            className="rounded-full p-2 h-8 w-8"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* To Token Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">To</span>
            <span className="text-muted-foreground">
              Price: ${formatTokenAmount(toTokenPrice, 2)}
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="0.00"
              value={getOutputAmount()}
              readOnly
              className="flex-1 bg-muted"
            />
            <Badge variant="outline" className="px-3 py-2 font-medium">
              {toTokenType}
            </Badge>
          </div>
        </div>

        {/* Quote Information */}
        {quote && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price Impact</span>
              <span className={cn(
                parseFloat(priceImpact) < 1 ? 'text-green-600' : 
                parseFloat(priceImpact) < 3 ? 'text-yellow-600' : 
                'text-red-600'
              )}>
                {parseFloat(priceImpact).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slippage</span>
              <span>{(slippage / 100).toFixed(1)}%</span>
            </div>
          </div>
        )}

        {/* Slippage Settings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Slippage Tolerance</span>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex gap-2">
            {[25, 50, 100].map((bps) => (
              <Button
                key={bps}
                variant={slippage === bps ? "default" : "outline"}
                size="sm"
                onClick={() => setSlippage(bps)}
                className="flex-1"
              >
                {(bps / 100).toFixed(1)}%
              </Button>
            ))}
          </div>
        </div>

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!connected || !amount || !quote || swapping || loading}
          className="w-full"
          size="lg"
        >
          {!connected ? 'Connect Wallet' :
           swapping ? 'Swapping...' :
           loading ? 'Getting Quote...' :
           `Swap ${fromTokenType} for ${toTokenType}`}
        </Button>

        {/* Warning for high price impact */}
        {quote && parseFloat(priceImpact) > 3 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            ⚠️ High price impact ({parseFloat(priceImpact).toFixed(2)}%). 
            Consider reducing your swap amount.
          </div>
        )}
      </CardContent>
    </Card>
  );
} 