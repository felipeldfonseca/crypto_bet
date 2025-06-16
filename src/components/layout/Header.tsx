"use client"

import React, { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavigationPopover, PopoverProvider } from './NavigationPopover';
import { WalletConnectButton } from '@/components/shared/WalletConnectButton';
import { CompactModeToggle } from '@/components/shared/ModeToggle';
import { useTheme } from '@/components/providers/ThemeProvider';

interface HeaderProps {
  className?: string;
}

// Memoized navigation items to prevent recreation
const NAVIGATION_ITEMS = [
  {
    title: 'Markets',
    href: '/markets',
    description: 'Browse active prediction markets'
  },
  {
    title: 'Swap',
    href: '/swap', 
    description: 'Exchange tokens instantly'
  }
] as const;

// Memoized logo component
const Logo = React.memo(function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">CB</span>
      </div>
      <span className="font-bold text-xl">Crypto Bet</span>
    </Link>
  );
});

// Memoized navigation menu component
const NavigationMenu = React.memo(function NavigationMenu() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6">
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
});

// Memoized mobile navigation component
const MobileNavigation = React.memo(function MobileNavigation() {
  return (
    <div className="md:hidden">
      <NavigationPopover
        title="Menu"
        items={NAVIGATION_ITEMS}
        id="mobile-nav"
      />
    </div>
  );
});

// Memoized header actions component
const HeaderActions = React.memo(function HeaderActions() {
  return (
    <div className="flex items-center gap-3">
      <CompactModeToggle />
      <WalletConnectButton />
    </div>
  );
});

export const Header = React.memo<HeaderProps>(function Header({ 
  className 
}) {
  const theme = useTheme();

  // Memoized header classes
  const headerClasses = useMemo(() => cn(
    'sticky top-0 z-50 w-full border-b backdrop-blur-sm transition-colors duration-200',
    theme.headerBg,
    className
  ), [theme.headerBg, className]);

  return (
    <PopoverProvider>
      <header className={headerClasses}>
        <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            
            <NavigationMenu />
            
            <HeaderActions />
            
            <MobileNavigation />
          </div>
        </div>
      </header>
    </PopoverProvider>
  );
}); 