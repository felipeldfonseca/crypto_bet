"use client"

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/providers/ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Copy, LogOut } from 'lucide-react';
import { debounce } from '@/lib/performance';

interface WalletConnectButtonProps {
  className?: string;
}

// Memoized dropdown menu item components
const AddressMenuItem = React.memo<{ address: string; onCopy: () => void }>(function AddressMenuItem({ address, onCopy }) {
  const shortenedAddress = useMemo(() => 
    `${address.slice(0, 4)}...${address.slice(-4)}`, 
    [address]
  );

  return (
    <DropdownMenuItem onClick={onCopy} className="cursor-pointer">
      <Copy className="mr-2 h-4 w-4" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Address</span>
        <span className="font-mono text-sm">{shortenedAddress}</span>
      </div>
    </DropdownMenuItem>
  );
});

const BalanceMenuItem = React.memo<{ balance: number }>(function BalanceMenuItem({ balance }) {
  const formattedBalance = useMemo(() => balance.toFixed(4), [balance]);

  return (
    <DropdownMenuItem className="cursor-default">
      <div className="flex flex-col w-full">
        <span className="text-xs text-muted-foreground">Balance</span>
        <span className="font-mono text-sm">{formattedBalance} SOL</span>
      </div>
    </DropdownMenuItem>
  );
});

export const WalletConnectButton = React.memo<WalletConnectButtonProps>(function WalletConnectButton({ 
  className 
}) {
  const { publicKey, disconnect } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const theme = useTheme();

  // Memoized address string to prevent recreation
  const addressString = useMemo(() => 
    publicKey?.toString() || '', 
    [publicKey]
  );

  // Memoized shortened address
  const shortenedAddress = useMemo(() => {
    if (!addressString) return '';
    return `${addressString.slice(0, 4)}...${addressString.slice(-4)}`;
  }, [addressString]);

  // Debounced balance fetching to prevent excessive RPC calls
  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    setIsLoadingBalance(true);
    try {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(null);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [publicKey, connection]);

  // Debounced balance fetching to prevent excessive API calls
  const debouncedFetchBalance = useMemo(
    () => debounce(fetchBalance, 1000),
    [fetchBalance]
  );

  // Fetch SOL balance when wallet is connected
  useEffect(() => {
    if (publicKey) {
      debouncedFetchBalance();
      
      // Set up periodic balance updates (every 30 seconds)
      const interval = setInterval(() => {
        fetchBalance();
      }, 30000);
      
      return () => {
        clearInterval(interval);
        debouncedFetchBalance.cancel();
      };
    } else {
      setBalance(null);
      setIsLoadingBalance(false);
    }
  }, [publicKey, debouncedFetchBalance, fetchBalance]);

  // Memoized event handlers
  const handleConnect = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const copyAddress = useCallback(() => {
    if (addressString) {
      navigator.clipboard.writeText(addressString);
    }
  }, [addressString]);

  // Memoized button styles
  const buttonStyles = useMemo(() => {
    const baseStyles = className || '';
    const themeStyles = theme.isDramatic 
      ? 'bg-orange-500 text-white hover:bg-orange-600 border-orange-500' 
      : 'bg-slate-800 text-white hover:bg-slate-900 border-slate-800';
    return `${baseStyles} ${themeStyles}`;
  }, [className, theme.isDramatic]);

  // Render connect button if not connected
  if (!publicKey) {
    return (
      <Button 
        variant="default"
        className={buttonStyles}
        onClick={handleConnect}
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="default" 
          className={`rounded-full flex items-center gap-2 ${buttonStyles}`}
        >
          {shortenedAddress}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Wallet Info</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <AddressMenuItem address={addressString} onCopy={copyAddress} />
        
        {balance !== null && !isLoadingBalance && (
          <BalanceMenuItem balance={balance} />
        )}
        
        {isLoadingBalance && (
          <DropdownMenuItem className="cursor-default">
            <div className="flex flex-col w-full">
              <span className="text-xs text-muted-foreground">Balance</span>
              <span className="font-mono text-sm">Loading...</span>
            </div>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}); 