'use client';

import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useBettingMode } from '@/components/providers/BettingModeProvider';

// Shared popover state context
interface PopoverContextType {
  activePopover: string | null;
  setActivePopover: (id: string | null) => void;
  timeoutId: NodeJS.Timeout | null;
  setTimeoutId: (id: NodeJS.Timeout | null) => void;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

// Memoized context provider for better performance
export const PopoverProvider = React.memo<{ children: React.ReactNode }>(function PopoverProvider({ children }) {
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<PopoverContextType>(() => ({
    activePopover,
    setActivePopover,
    timeoutId,
    setTimeoutId,
  }), [activePopover, timeoutId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  );
});

function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (context === undefined) {
    throw new Error('usePopoverContext must be used within a PopoverProvider');
  }
  return context;
}

interface NavigationItem {
  title: string;
  description: string;
  href: string;
  external?: boolean;
  onClick?: () => void;
}

interface NavigationPopoverProps {
  title: string;
  items: readonly NavigationItem[];
  className?: string;
  id: string;
}

interface NavigationPopoverPropsExtended extends NavigationPopoverProps {
  directHref?: string;
  directExternal?: boolean;
}

// Memoized navigation item component for better performance
const NavigationMenuItem = React.memo<{
  item: NavigationItem;
  index: number;
  theme: any;
}>(function NavigationMenuItem({ item, index, theme }) {
  const handleClick = useCallback(() => {
    item.onClick?.();
  }, [item]);

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center justify-between px-4 py-3 transition-colors duration-150",
          theme.isDramatic 
            ? "hover:bg-slate-700/50" 
            : "hover:bg-gray-50"
        )}
        onClick={handleClick}
      >
        <div>
          <div className={cn(
            "font-medium text-sm",
            theme.isDramatic ? theme.textPrimary : "text-gray-900"
          )}>
            {item.title}
          </div>
          <div className={cn(
            "text-xs mt-0.5",
            theme.isDramatic ? theme.textSecondary : "text-gray-500"
          )}>
            {item.description}
          </div>
        </div>
        <ExternalLink className={cn(
          "h-4 w-4",
          theme.isDramatic ? theme.textSecondary : "text-gray-400"
        )} />
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center justify-between px-4 py-3 transition-colors duration-150",
        theme.isDramatic 
          ? "hover:bg-slate-700/50" 
          : "hover:bg-gray-50"
      )}
      onClick={handleClick}
    >
      <div>
        <div className={cn(
          "font-medium text-sm",
          theme.isDramatic ? theme.textPrimary : "text-gray-900"
        )}>
          {item.title}
        </div>
        <div className={cn(
          "text-xs mt-0.5",
          theme.isDramatic ? theme.textSecondary : "text-gray-500"
        )}>
          {item.description}
        </div>
      </div>
    </Link>
  );
});

export const NavigationPopover = React.memo<NavigationPopoverPropsExtended>(function NavigationPopover({ 
  title, 
  items, 
  className, 
  directHref, 
  directExternal = false,
  id
}) {
  const { activePopover, setActivePopover, timeoutId, setTimeoutId } = usePopoverContext();
  const { setMode } = useBettingMode();
  const theme = useTheme();
  const isOpen = activePopover === id;

  // Memoize event handlers to prevent recreation
  const handleMouseEnter = useCallback(() => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    // Immediately set this popover as active (closes others instantly)
    setActivePopover(id);
  }, [timeoutId, setTimeoutId, setActivePopover, id]);

  const handleMouseLeave = useCallback(() => {
    // Delay before closing to allow mouse movement to popover
    const newTimeoutId = setTimeout(() => {
      setActivePopover(null);
    }, 200);
    setTimeoutId(newTimeoutId);
  }, [setActivePopover, setTimeoutId]);

  const handleDirectClick = useCallback(() => {
    if (directHref) {
      if (directExternal) {
        window.open(directHref, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = directHref;
      }
    }
  }, [directHref, directExternal]);

  // Memoize button classes for performance
  const buttonClasses = useMemo(() => cn(
    "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 relative z-10",
    theme.isDramatic 
      ? `${theme.textPrimary} hover:${theme.accent.replace('text-', 'text-')}`
      : "text-foreground hover:text-primary"
  ), [theme]);

  // Memoize popover content classes
  const popoverClasses = useMemo(() => cn(
    'rounded-lg shadow-lg min-w-[280px] py-2 backdrop-blur-sm',
    'animate-in fade-in-0 slide-in-from-top-2 duration-200',
    theme.isDramatic 
      ? `${theme.cardBg} ${theme.border} shadow-2xl shadow-black/20`
      : 'bg-white border border-gray-200'
  ), [theme]);

  return (
    <div className={cn('relative', className)}>
      {/* Unified hover detection area - includes button + space below + popover area */}
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Extended hover zone for upward mouse movement */}
        <div className="absolute inset-x-0 -bottom-4 h-6 bg-transparent pointer-events-auto" />
        
        {/* Trigger Button */}
        <button
          className={buttonClasses}
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={handleDirectClick}
        >
          {title}
          <ChevronDown 
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} 
          />
        </button>
        
        {/* Popover Content - part of the same hover area */}
        {isOpen && (
          <div className="absolute top-full left-0 z-50 pt-2">
            <div className={popoverClasses}>
              {items.map((item, index) => (
                <NavigationMenuItem
                  key={`${item.href}-${index}`}
                  item={item}
                  index={index}
                  theme={theme}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Navigation configuration - memoized for performance
export const NAVIGATION_CONFIG = {
  products: {
    title: 'Products',
    items: [
      {
        title: 'Prediction Markets',
        description: 'Bet on crypto narratives and trends',
        href: '/markets'
      },
      {
        title: 'Token Swap',
        description: 'Powered by Jupiter aggregator',
        href: '/swap'
      }
    ]
  },
  trade: {
    title: 'Trade',
    directHref: '/markets',
    items: [
      {
        title: 'Live Markets',
        description: 'Active prediction markets',
        href: '/markets'
      },
      {
        title: 'Market History',
        description: 'Past market performance',
        href: '/history'
      }
    ]
  },
  developers: {
    title: 'Developers',
    directHref: 'https://docs.cryptobet.com',
    directExternal: true,
    items: [
      {
        title: 'API Documentation',
        description: 'Integrate with our platform',
        href: 'https://docs.cryptobet.com/api',
        external: true
      },
      {
        title: 'GitHub',
        description: 'Open source components',
        href: 'https://github.com/cryptobet',
        external: true
      }
    ]
  }
} as const; 