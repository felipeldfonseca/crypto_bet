"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WalletConnectButton } from '@/components/shared/WalletConnectButton';
import { CompactModeToggle } from '@/components/shared/ModeToggle';
import { NavigationPopover, PopoverProvider, NAVIGATION_CONFIG } from './NavigationPopover';
import { useTheme } from '@/components/providers/ThemeProvider';

interface HeaderProps {
  showWalletButton?: boolean;
  showModeToggle?: boolean;
  showNavigation?: boolean;
  layout?: 'landing' | 'app';
}

export const Header: React.FC<HeaderProps> = ({ 
  showWalletButton = false,
  showModeToggle = false,
  showNavigation = false,
  layout = 'landing'
}) => {
  const theme = useTheme();
  
  return (
    <PopoverProvider>
      <header className={`w-full h-20 flex items-center backdrop-blur-sm border-b transition-all duration-500 ${theme.getHeaderClasses()} ${theme.border}`}>
        <div className="container mx-auto w-full max-w-[1120px] flex items-center justify-between px-6 md:px-10">
        {/* Left Side - Logo + Navigation (for app layout) */}
        <div className="flex items-center gap-8">
          <Link href="/" className={`text-2xl font-bold hover:opacity-80 transition-all duration-300 ${theme.isDramatic ? theme.accent : 'text-foreground'}`}>
            Crypto Bet
          </Link>

          {/* Navigation for App Layout (left side) */}
          {showNavigation && layout === 'app' && (
            <nav className="hidden md:flex items-center gap-2">
              <NavigationPopover
                id="products-app"
                title={NAVIGATION_CONFIG.products.title}
                items={NAVIGATION_CONFIG.products.items}
              />
              <NavigationPopover
                id="trade-app"
                title={NAVIGATION_CONFIG.trade.title}
                items={NAVIGATION_CONFIG.trade.items}
                directHref={NAVIGATION_CONFIG.trade.directHref}
              />
              <NavigationPopover
                id="developers-app"
                title={NAVIGATION_CONFIG.developers.title}
                items={NAVIGATION_CONFIG.developers.items}
                directHref={NAVIGATION_CONFIG.developers.directHref}
                directExternal={NAVIGATION_CONFIG.developers.directExternal}
              />
            </nav>
          )}
        </div>

        {/* Right Side - Navigation (for landing) + Controls */}
        <div className="flex items-center gap-4">
          {/* Navigation for Landing Layout (right side) */}
          {showNavigation && layout === 'landing' && (
            <nav className="hidden md:flex items-center gap-2 mr-4">
              <NavigationPopover
                id="products-landing"
                title={NAVIGATION_CONFIG.products.title}
                items={NAVIGATION_CONFIG.products.items}
              />
              <NavigationPopover
                id="trade-landing"
                title={NAVIGATION_CONFIG.trade.title}
                items={NAVIGATION_CONFIG.trade.items}
                directHref={NAVIGATION_CONFIG.trade.directHref}
              />
              <NavigationPopover
                id="developers-landing"
                title={NAVIGATION_CONFIG.developers.title}
                items={NAVIGATION_CONFIG.developers.items}
                directHref={NAVIGATION_CONFIG.developers.directHref}
                directExternal={NAVIGATION_CONFIG.developers.directExternal}
              />
            </nav>
          )}

          {/* Mode Toggle */}
          {showModeToggle && <CompactModeToggle />}
          
          {/* CTA Button or Wallet Button */}
          {showWalletButton ? (
            <WalletConnectButton />
          ) : (
            <Link href="/markets">
              <Button className="rounded-full">
                {showNavigation ? 'Open App' : 'Launch App'}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
    </PopoverProvider>
  );
}; 