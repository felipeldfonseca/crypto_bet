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
import { ArrowUpDown, Settings, RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import { debounce } from '@/lib/performance';
import { 
  WalletSecurity, 
  SecurityMonitor, 
  TransactionSecurity,
  EnvironmentSecurity 
} from '@/lib/security';

interface TokenSwapProps {
  className?: string;
  fromToken?: TokenType;
  toToken?: TokenType;
  onSwapComplete?: (signature: string) => void;
  onError?: (error: string) => void;
}

const SecurityAlert = React.memo<{ 
  type: 'warning' | 'error' | 'info';
  message: string;
}>(function SecurityAlert({ type, message }) {
  const icons = {
    warning: <AlertTriangle className="h-4 w-4" />,
    error: <AlertTriangle className="h-4 w-4" />,
    info: <Shield className="h-4 w-4" />
  };

  const styles = {
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={cn('flex items-center gap-2 p-3 border rounded-md text-sm', styles[type])}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
});

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
  const [securityAlerts, setSecurityAlerts] = useState<Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
  }>>([]);

  const fromTokenConfig = useMemo(() => TOKENS[fromTokenType], [fromTokenType]);
  const toTokenConfig = useMemo(() => TOKENS[toTokenType], [toTokenType]);

  const amountInBaseUnits = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return 0;
    return fromTokenType === 'SOL' 
      ? Math.floor(parseFloat(amount) * 1e9)
      : Math.floor(parseFloat(amount) * 1e6);
  }, [amount, fromTokenType]);

  const validateSwapSecurity = useCallback((swapAmount: number): { isValid: boolean; alerts: Array<{ type: 'warning' | 'error' | 'info'; message: string }> } => {
    const alerts: Array<{ type: 'warning' | 'error' | 'info'; message: string }> = [];

    if (!connected || !publicKey) {
      alerts.push({ type: 'error', message: 'Wallet not connected' });
      return { isValid: false, alerts };
    }

    if (!WalletSecurity.validatePublicKey(publicKey.toString())) {
      alerts.push({ type: 'error', message: 'Invalid wallet address format' });
      SecurityMonitor.logSecurityEvent('invalid_wallet_format', 'high', {
        publicKey: publicKey.toString()
      });
      return { isValid: false, alerts };
    }

    const reputationCheck = WalletSecurity.checkWalletReputation(publicKey.toString());
    if (reputationCheck.isSuspicious) {
      alerts.push({ type: 'warning', message: `Wallet security warning: ${reputationCheck.reason}` });
      SecurityMonitor.logSecurityEvent('suspicious_wallet', 'medium', {
        publicKey: publicKey.toString(),
        reason: reputationCheck.reason
      });
    }

    if (!WalletSecurity.checkRateLimit(publicKey.toString(), 5, 60000)) {
      alerts.push({ type: 'error', message: 'Rate limit exceeded. Please wait before making another swap.' });
      SecurityMonitor.logSecurityEvent('rate_limit_exceeded', 'medium', {
        publicKey: publicKey.toString(),
        operation: 'swap'
      });
      return { isValid: false, alerts };
    }

    const transactionValidation = TransactionSecurity.validateTransactionParams({
      amount: swapAmount,
      operation: 'swap'
    });

    if (!transactionValidation.isValid) {
      alerts.push({ type: 'error', message: 'Transaction validation failed' });
      SecurityMonitor.logSecurityEvent('transaction_validation_failed', 'high', {
        errors: transactionValidation.errors,
        amount: swapAmount
      });
      return { isValid: false, alerts };
    }

    const transactionAnalysis = TransactionSecurity.analyzeTransaction({
      amount: swapAmount,
      fromToken: fromTokenType,
      toToken: toTokenType
    });

    if (transactionAnalysis.isSuspicious) {
      alerts.push({ 
        type: 'warning', 
        message: `Large transaction detected: ${transactionAnalysis.reasons.join(', ')}` 
      });
      SecurityMonitor.logSecurityEvent('suspicious_transaction', 'medium', {
        reasons: transactionAnalysis.reasons,
        amount: swapAmount,
        tokens: `${fromTokenType}->${toTokenType}`
      });
    }

    const envCheck = EnvironmentSecurity.validateEnvironment();
    if (!envCheck.isSecure) {
      alerts.push({ type: 'info', message: 'Development environment detected' });
    }

    return { isValid: true, alerts };
  }, [connected, publicKey, fromTokenType, toTokenType]);

  const fetchQuote = useCallback(async () => {
    if (amountInBaseUnits <= 0 || !connected) return;

    const securityCheck = validateSwapSecurity(parseFloat(amount));
    setSecurityAlerts(securityCheck.alerts);

    if (!securityCheck.isValid) {
      return;
    }

    setLoading(true);
    try {
      const inputMint = TOKENS[fromTokenType];
      const outputMint = TOKENS[toTokenType];
      
      const quoteData = await getSwapQuote(
        inputMint,
        outputMint,
        amountInBaseUnits,
        slippage
      );

      setQuote(quoteData);

      SecurityMonitor.logSecurityEvent('quote_fetched', 'low', {
        fromToken: fromTokenType,
        toToken: toTokenType,
        amount: parseFloat(amount),
        slippage
      });

    } catch (error) {
      SecurityMonitor.logSecurityEvent('quote_fetch_failed', 'medium', {
        error: error instanceof Error ? error.message : 'Unknown error',
        fromToken: fromTokenType,
        toToken: toTokenType
      });
      EnvironmentSecurity.secureLog('Failed to fetch quote:', error);
      onError?.('Failed to fetch swap quote');
    } finally {
      setLoading(false);
    }
  }, [amountInBaseUnits, connected, fromTokenType, toTokenType, slippage, amount, validateSwapSecurity, onError]);

  const debouncedFetchQuote = useMemo(
    () => debounce(fetchQuote, 1000),
    [fetchQuote]
  );

  const fetchPrices = useCallback(async () => {
    try {
      const [fromPrice, toPrice] = await Promise.all([
        getTokenPrice(fromTokenConfig),
        getTokenPrice(toTokenConfig)
      ]);
      setFromTokenPrice(fromPrice);
      setToTokenPrice(toPrice);
    } catch (error) {
      EnvironmentSecurity.secureLog('Failed to fetch prices:', error);
    }
  }, [fromTokenConfig, toTokenConfig]);

  useEffect(() => {
    if (amountInBaseUnits > 0) {
      debouncedFetchQuote();
    } else {
      setQuote(null);
    }

    return () => {
      debouncedFetchQuote.cancel();
    };
  }, [amountInBaseUnits, debouncedFetchQuote]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const handleSwap = useCallback(async () => {
    if (!connected || !publicKey || !signTransaction || !quote) {
      const errorMsg = 'Wallet not connected or quote unavailable';
      onError?.(errorMsg);
      SecurityMonitor.logSecurityEvent('swap_attempt_failed', 'medium', {
        reason: errorMsg,
        connected,
        hasPublicKey: !!publicKey,
        hasQuote: !!quote
      });
      return;
    }

    const securityCheck = validateSwapSecurity(parseFloat(amount));
    setSecurityAlerts(securityCheck.alerts);

    if (!securityCheck.isValid) {
      SecurityMonitor.logSecurityEvent('swap_security_check_failed', 'high', {
        publicKey: publicKey.toString(),
        amount: parseFloat(amount)
      });
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

      SecurityMonitor.logSecurityEvent('swap_attempt', 'low', {
        fromToken: fromTokenType,
        toToken: toTokenType,
        amount: parseFloat(amount),
        publicKey: publicKey.toString().substring(0, 8) + '...'
      });

      const signature = await executeSwap(connection, swapRequest, signTransaction);
      
      if (!WalletSecurity.validateTransactionSignature(signature)) {
        throw new Error('Invalid transaction signature received');
      }

      SecurityMonitor.logSecurityEvent('swap_success', 'low', {
        signature: signature.substring(0, 8) + '...',
        fromToken: fromTokenType,
        toToken: toTokenType,
        amount: parseFloat(amount)
      });

      onSwapComplete?.(signature);
      
      setAmount('');
      setQuote(null);
      setSecurityAlerts([]);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Swap failed';
      
      SecurityMonitor.logSecurityEvent('swap_failed', 'medium', {
        error: errorMessage,
        fromToken: fromTokenType,
        toToken: toTokenType,
        amount: parseFloat(amount),
        publicKey: publicKey.toString().substring(0, 8) + '...'
      });
      
      EnvironmentSecurity.secureLog('Swap execution failed:', error);
      onError?.(errorMessage);
    } finally {
      setSwapping(false);
    }
  }, [connected, publicKey, signTransaction, quote, fromTokenType, toTokenType, amountInBaseUnits, slippage, connection, onSwapComplete, onError, amount, validateSwapSecurity]);

  const handleFlipTokens = useCallback(() => {
    setFromTokenType(toTokenType);
    setToTokenType(fromTokenType);
    setAmount('');
    setQuote(null);
    setSecurityAlerts([]);
    
    SecurityMonitor.logSecurityEvent('tokens_flipped', 'low', {
      newFromToken: toTokenType,
      newToToken: fromTokenType
    });
  }, [fromTokenType, toTokenType]);

  const outputAmount = useMemo(() => {
    if (!quote) return '0';
    const decimals = toTokenType === 'SOL' ? 9 : 6;
    const outputAmount = parseInt(quote.outAmount) / Math.pow(10, decimals);
    return formatTokenAmount(outputAmount);
  }, [quote, toTokenType]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
      return;
    }
    
    setAmount(value);
    
    if (securityAlerts.length > 0) {
      setSecurityAlerts([]);
    }
  }, [securityAlerts]);

  const handleRefresh = useCallback(() => {
    if (amountInBaseUnits > 0) {
      fetchQuote();
    }
  }, [fetchQuote, amountInBaseUnits]);

  useEffect(() => {
    if (quote && fromTokenPrice && toTokenPrice && parseFloat(amount) > 0) {
      const inputValue = parseFloat(amount) * fromTokenPrice;
      const outputValue = parseFloat(outputAmount) * toTokenPrice;
      const impact = ((inputValue - outputValue) / inputValue) * 100;
      setPriceImpact(impact.toFixed(2));
    } else {
      setPriceImpact('0');
    }
  }, [quote, fromTokenPrice, toTokenPrice, amount, outputAmount]);

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Token Swap</span>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading || amountInBaseUnits <= 0}
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {securityAlerts.length > 0 && (
          <div className="space-y-2">
            {securityAlerts.map((alert, index) => (
              <SecurityAlert key={index} type={alert.type} message={alert.message} />
            ))}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">From</label>
            <Badge variant="outline">{fromTokenType}</Badge>
          </div>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={handleAmountChange}
            className="text-lg"
            min="0"
            step="0.000001"
            max="1000000"
          />
          {fromTokenPrice > 0 && amount && (
            <p className="text-xs text-muted-foreground">
              ≈ ${(parseFloat(amount) * fromTokenPrice).toFixed(2)} USD
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFlipTokens}
            className="rounded-full p-2"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">To</label>
            <Badge variant="outline">{toTokenType}</Badge>
          </div>
          <div className="p-3 bg-muted rounded-md">
            <div className="text-lg font-medium">
              {loading ? 'Loading...' : outputAmount}
            </div>
            {toTokenPrice > 0 && outputAmount !== '0' && (
              <p className="text-xs text-muted-foreground">
                ≈ ${(parseFloat(outputAmount) * toTokenPrice).toFixed(2)} USD
              </p>
            )}
          </div>
        </div>

        {quote && (
          <div className="space-y-2 p-3 bg-muted/50 rounded-md text-sm">
            <div className="flex justify-between">
              <span>Price Impact</span>
              <span className={cn(
                parseFloat(priceImpact) > 5 ? 'text-red-600' : 
                parseFloat(priceImpact) > 2 ? 'text-yellow-600' : 'text-green-600'
              )}>
                {priceImpact}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Slippage</span>
              <span>{(slippage / 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Security</span>
              <span className="text-green-600 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Protected
              </span>
            </div>
          </div>
        )}

        <Button
          onClick={handleSwap}
          disabled={!connected || !quote || swapping || loading || securityAlerts.some(alert => alert.type === 'error')}
          className="w-full"
          size="lg"
        >
          {!connected ? 'Connect Wallet' :
           swapping ? 'Swapping...' :
           loading ? 'Loading Quote...' :
           securityAlerts.some(alert => alert.type === 'error') ? 'Security Check Failed' :
           'Swap Tokens'}
        </Button>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>🔒 All transactions are validated and monitored for security</p>
          <p>⚡ Powered by Jupiter with enterprise-grade protection</p>
        </div>
      </CardContent>
    </Card>
  );
}); 