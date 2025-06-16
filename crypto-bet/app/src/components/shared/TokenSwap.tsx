'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { debounce } from '@/lib/performance';

interface TokenSwapProps {
  className?: string;
  fromToken?: TokenType;
  toToken?: TokenType;
  onSwapComplete?: (signature: string) => void;
  onError?: (error: string) => void;
}

export const TokenSwap = React.memo<TokenSwapProps>(function TokenSwap({
  className,
  fromToken = 'SOL',
  toToken = 'USDC',
  onSwapComplete,
  onError
}) {
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

  // Memoize token configurations to prevent recreation
  const fromTokenConfig = useMemo(() => TOKENS[fromTokenType], [fromTokenType]);
  const toTokenConfig = useMemo(() => TOKENS[toTokenType], [toTokenType]);

  // Memoize amount calculation to prevent unnecessary recalculations
  const amountInBaseUnits = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return 0;
    return fromTokenType === 'SOL' 
      ? Math.floor(parseFloat(amount) * 1e9)
      : Math.floor(parseFloat(amount) * 1e6);
  }, [amount, fromTokenType]);

  // Get real-time quote with debouncing to prevent excessive API calls
  const fetchQuote = useCallback(async () => {
    if (amountInBaseUnits <= 0) {
      setQuote(null);
      return;
    }

    setLoading(true);
    try {
      const quoteResponse = await getSwapQuote(
        fromTokenConfig,
        toTokenConfig,
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
  }, [amountInBaseUnits, fromTokenConfig, toTokenConfig, slippage]);

  // Debounced quote fetching to prevent excessive API calls
  const debouncedFetchQuote = useMemo(
    () => debounce(fetchQuote, 500),
    [fetchQuote]
  );

  // Fetch token prices with memoization
  const fetchPrices = useCallback(async () => {
    try {
      const [fromPrice, toPrice] = await Promise.all([
        getTokenPrice(fromTokenConfig),
        getTokenPrice(toTokenConfig)
      ]);
      setFromTokenPrice(fromPrice);
      setToTokenPrice(toPrice);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    }
  }, [fromTokenConfig, toTokenConfig]);

  // Auto-refresh quote with cleanup
  useEffect(() => {
    debouncedFetchQuote();
    
    const interval = setInterval(() => {
      if (amountInBaseUnits > 0) {
        fetchQuote();
      }
    }, 10000);
    
    return () => {
      clearInterval(interval);
      debouncedFetchQuote.cancel();
    };
  }, [debouncedFetchQuote, fetchQuote, amountInBaseUnits]);

  // Fetch prices on token change
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Memoized swap handler
  const handleSwap = useCallback(async () => {
    if (!connected || !publicKey || !signTransaction || !quote) {
      onError?.('Wallet not connected or quote unavailable');
      return;
    }

    setSwapping(true);
    try {
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
  }, [connected, publicKey, signTransaction, quote, fromTokenType, toTokenType, amountInBaseUnits, slippage, connection, onSwapComplete, onError]);

  // Memoized token flip handler
  const handleFlipTokens = useCallback(() => {
    setFromTokenType(toTokenType);
    setToTokenType(fromTokenType);
    setAmount('');
    setQuote(null);
  }, [fromTokenType, toTokenType]);

  // Memoized output amount calculation
  const outputAmount = useMemo(() => {
    if (!quote) return '0';
    const decimals = toTokenType === 'SOL' ? 9 : 6;
    const outputAmount = parseInt(quote.outAmount) / Math.pow(10, decimals);
    return formatTokenAmount(outputAmount);
  }, [quote, toTokenType]);

  // Memoized input change handler
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }, []);

  // Memoized refresh handler
  const handleRefresh = useCallback(() => {
    if (amountInBaseUnits > 0) {
      fetchQuote();
    }
  }, [fetchQuote, amountInBaseUnits]);

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Token Swap</span>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
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
              onChange={handleAmountChange}
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
              value={outputAmount}
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
          <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price Impact</span>
              <span className={cn(
                'font-medium',
                parseFloat(priceImpact) > 1 ? 'text-red-600' : 'text-green-600'
              )}>
                {priceImpact}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage</span>
              <span className="font-medium">{(slippage / 100).toFixed(2)}%</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!connected || !quote || loading || swapping || amountInBaseUnits <= 0}
          className="w-full"
          size="lg"
        >
          {swapping ? 'Swapping...' : !connected ? 'Connect Wallet' : 'Swap'}
        </Button>
      </CardContent>
    </Card>
  );
}); 