'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
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

const PopoverContext = createContext<PopoverContextType | null>(null);

export function PopoverProvider({ children }: { children: React.ReactNode }) {
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <PopoverContext.Provider value={{ activePopover, setActivePopover, timeoutId, setTimeoutId }}>
      {children}
    </PopoverContext.Provider>
  );
}

function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('usePopoverContext must be used within PopoverProvider');
  }
  return context;
}

interface PopoverItem {
  title: string;
  description: string;
  href: string;
  external?: boolean;
  onClick?: () => void;
}

interface NavigationPopoverProps {
  title: string;
  items: PopoverItem[];
  className?: string;
}

interface NavigationPopoverPropsExtended extends NavigationPopoverProps {
  directHref?: string;
  directExternal?: boolean;
  id: string; // Add unique ID for each popover
}

export function NavigationPopover({ 
  title, 
  items, 
  className, 
  directHref, 
  directExternal = false,
  id
}: NavigationPopoverPropsExtended) {
  const { activePopover, setActivePopover, timeoutId, setTimeoutId } = usePopoverContext();
  const { setMode } = useBettingMode();
  const theme = useTheme();
  const isOpen = activePopover === id;

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    // Immediately set this popover as active (closes others instantly)
    setActivePopover(id);
  };

  const handleMouseLeave = () => {
    // Delay before closing to allow mouse movement to popover
    const newTimeoutId = setTimeout(() => {
      setActivePopover(null);
    }, 200);
    setTimeoutId(newTimeoutId);
  };

  const handleDirectClick = () => {
    if (directHref) {
      if (directExternal) {
        window.open(directHref, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = directHref;
      }
    }
  };

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
          className={cn(
            "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 relative z-10",
            theme.isDramatic 
              ? `${theme.textPrimary} hover:${theme.accent.replace('text-', 'text-')}`
              : "text-foreground hover:text-primary"
          )}
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
            <div
              className={cn(
                'rounded-lg shadow-lg min-w-[280px] py-2 backdrop-blur-sm',
                'animate-in fade-in-0 slide-in-from-top-2 duration-200',
                theme.isDramatic 
                  ? `${theme.cardBg} ${theme.border} shadow-2xl shadow-black/20`
                  : 'bg-white border border-gray-200'
              )}
            >
              {items.map((item, index) => (
                <div key={index}>
                  {item.external ? (
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
                      onClick={item.onClick}
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
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-4 py-3 transition-colors duration-150",
                        theme.isDramatic 
                          ? "hover:bg-slate-700/50" 
                          : "hover:bg-gray-50"
                      )}
                      onClick={(e) => {
                        // Handle mode switching for Products popover
                        if (item.href.includes('mode=stable')) {
                          setMode('stable');
                        } else if (item.href.includes('mode=degen')) {
                          setMode('degen');
                        }
                        item.onClick?.();
                      }}
                    >
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
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Navigation configuration
export const NAVIGATION_CONFIG = {
  products: {
    title: 'Products',
    // Removed directHref to eliminate flickering - only popover navigation now
    items: [
      {
        title: 'Stable Mode',
        description: 'USD-stable prediction betting',
        href: '/markets?mode=stable'
      },
      {
        title: 'Degen Mode',
        description: 'High-volatility SOL betting',
        href: '/markets?mode=degen'
      }
    ]
  },
  trade: {
    title: 'Trade',
    directHref: '/swap', // Click "Trade" → go directly to swap
    items: [
      {
        title: 'Swap',
        description: 'Seamless SOL-USDC conversion',
        href: '/swap'
      }
    ]
  },
  developers: {
    title: 'Developers',
    directHref: 'https://github.com/felipeldfonseca/crypto_bet', // Click "Developers" → go directly to GitHub
    directExternal: true,
    items: [
      {
        title: 'GitHub Documentation',
        description: 'Open source code repository',
        href: 'https://github.com/felipeldfonseca/crypto_bet',
        external: true
      }
    ]
  }
}; 