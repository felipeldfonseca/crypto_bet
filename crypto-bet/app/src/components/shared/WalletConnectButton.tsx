"use client"

import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Copy, LogOut } from 'lucide-react';

interface WalletConnectButtonProps {
  className?: string;
}

export function WalletConnectButton({ className }: WalletConnectButtonProps) {
  const { publicKey, disconnect } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const [balance, setBalance] = useState<number | null>(null);

  // Fetch SOL balance when wallet is connected
  useEffect(() => {
    if (publicKey) {
      const fetchBalance = async () => {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        }
      };
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [publicKey, connection]);

  const handleConnect = () => {
    setVisible(true);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!publicKey) {
    return (
      <Button 
        variant="outline" 
        className={className}
        onClick={handleConnect}
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`rounded-full flex items-center gap-2 ${className}`}>
          {shortenAddress(publicKey.toString())}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Wallet Info</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Address</span>
            <span className="font-mono text-sm">{shortenAddress(publicKey.toString())}</span>
          </div>
        </DropdownMenuItem>
        {balance !== null && (
          <DropdownMenuItem className="cursor-default">
            <div className="flex flex-col w-full">
              <span className="text-xs text-muted-foreground">Balance</span>
              <span className="font-mono text-sm">{balance.toFixed(4)} SOL</span>
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
} 