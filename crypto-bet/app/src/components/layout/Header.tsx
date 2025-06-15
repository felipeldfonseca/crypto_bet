"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WalletConnectButton } from '@/components/shared/WalletConnectButton';

interface HeaderProps {
  showWalletButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showWalletButton = false }) => {
  return (
    <header className="w-full h-20 flex items-center">
      <div className="container mx-auto w-full max-w-[1120px] flex items-center justify-between px-6 md:px-10">
        {/* Logo Link */}
        <Link href="/" className="text-2xl font-bold text-foreground hover:opacity-80 transition-opacity">
          Crypto Bet
        </Link>

        {/* CTA Button or Wallet Button */}
        {showWalletButton ? (
          <WalletConnectButton />
        ) : (
          <Link href="/markets">
            <Button className="rounded-full">
              Launch App
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}; 