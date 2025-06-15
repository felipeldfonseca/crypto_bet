'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useBettingMode } from './BettingModeProvider';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { getModeConfig } = useBettingMode();
  const pathname = usePathname();
  const config = getModeConfig();
  const [isNavigating, setIsNavigating] = React.useState(false);
  
  // Only apply dramatic theming on the markets page
  const shouldUseDramaticTheme = pathname === '/markets' && config.isDramatic;

  // Track navigation changes
  React.useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    // Skip theme changes during navigation to prevent flickering
    if (isNavigating) return;
    
    // Longer delay to prevent flickering during navigation
    const timeoutId = setTimeout(() => {
      // Apply theme to document body
      const body = document.body;
      
      // Remove all existing theme classes
      body.classList.remove(
        'bg-white', 'bg-slate-900',
        'text-gray-900', 'text-white',
        'transition-colors', 'duration-500'
      );
      
      // Apply theme classes based on page and mode
      if (shouldUseDramaticTheme) {
        body.classList.add(
          config.bodyBg,
          config.textPrimary,
          'transition-colors',
          'duration-500'
        );
      } else {
        // Always use light theme for non-markets pages
        body.classList.add(
          'bg-white',
          'text-gray-900',
          'transition-colors',
          'duration-500'
        );
      }

      // Apply CSS custom properties for dynamic theming
      const themeConfig = shouldUseDramaticTheme ? config : {
        bodyBg: 'bg-white',
        headerBg: 'bg-white/90',
        cardBg: 'bg-white',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-600',
        accent: 'text-blue-600',
        border: 'border-gray-200',
        isDramatic: false
      };

      document.documentElement.style.setProperty('--theme-body-bg', themeConfig.bodyBg);
      document.documentElement.style.setProperty('--theme-header-bg', themeConfig.headerBg);
      document.documentElement.style.setProperty('--theme-card-bg', themeConfig.cardBg);
      document.documentElement.style.setProperty('--theme-text-primary', themeConfig.textPrimary);
      document.documentElement.style.setProperty('--theme-text-secondary', themeConfig.textSecondary);
      document.documentElement.style.setProperty('--theme-accent', themeConfig.accent);
      document.documentElement.style.setProperty('--theme-border', themeConfig.border);
      document.documentElement.style.setProperty('--theme-is-dramatic', themeConfig.isDramatic ? '1' : '0');
    }, 150); // 150ms delay to prevent flickering

    return () => clearTimeout(timeoutId);
  }, [config, shouldUseDramaticTheme, pathname, isNavigating]);

  return <>{children}</>;
}

// Hook to get current theme classes
export function useTheme() {
  const { getModeConfig } = useBettingMode();
  const pathname = usePathname();
  const config = getModeConfig();
  
  // Only apply dramatic theming on the markets page
  const shouldUseDramaticTheme = pathname === '/markets' && config.isDramatic;
  
  const themeConfig = shouldUseDramaticTheme ? config : {
    bodyBg: 'bg-white',
    headerBg: 'bg-white/90',
    cardBg: 'bg-white',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'text-blue-600',
    border: 'border-gray-200',
    isDramatic: false
  };

  return {
    bodyBg: themeConfig.bodyBg,
    headerBg: themeConfig.headerBg,
    cardBg: themeConfig.cardBg,
    textPrimary: themeConfig.textPrimary,
    textSecondary: themeConfig.textSecondary,
    accent: themeConfig.accent,
    border: themeConfig.border,
    isDramatic: themeConfig.isDramatic,
    // Utility functions
    getCardClasses: () => `${themeConfig.cardBg} ${themeConfig.border} ${themeConfig.textPrimary}`,
    getHeaderClasses: () => `${themeConfig.headerBg} ${themeConfig.textPrimary}`,
    getAccentClasses: () => themeConfig.accent,
  };
} 