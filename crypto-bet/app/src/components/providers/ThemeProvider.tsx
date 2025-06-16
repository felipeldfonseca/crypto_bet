'use client';

import React, { useEffect, useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useBettingMode } from './BettingModeProvider';
import { debounce, batchDOMUpdates } from '@/lib/performance';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Memoize theme configurations to prevent recreation
const LIGHT_THEME_CONFIG = {
  bodyBg: 'bg-white',
  headerBg: 'bg-white/90',
  cardBg: 'bg-white',
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-600',
  accent: 'text-blue-600',
  border: 'border-gray-200',
  isDramatic: false
} as const;

export const ThemeProvider = React.memo<ThemeProviderProps>(function ThemeProvider({ children }) {
  const { getModeConfig } = useBettingMode();
  const pathname = usePathname();
  const config = getModeConfig();
  const [isNavigating, setIsNavigating] = React.useState(false);
  
  // Memoize theme decision to prevent recalculation
  const shouldUseDramaticTheme = useMemo(() => 
    pathname === '/markets' && config.isDramatic, 
    [pathname, config.isDramatic]
  );

  // Memoize final theme config
  const themeConfig = useMemo(() => 
    shouldUseDramaticTheme ? config : LIGHT_THEME_CONFIG,
    [shouldUseDramaticTheme, config]
  );

  // Optimize DOM manipulation with batch updates
  const applyThemeToDOM = useCallback((theme: typeof themeConfig) => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const body = document.body;
      const root = document.documentElement;
      
      // Batch all DOM updates together
      batchDOMUpdates([
        () => {
          // Remove old classes
          const classesToRemove = [
            'bg-white', 'bg-slate-900',
            'text-gray-900', 'text-white',
            'transition-colors', 'duration-500'
          ];
          body.classList.remove(...classesToRemove);
        },
        () => {
          // Add new classes
          const classesToAdd = [
            theme.bodyBg,
            theme.textPrimary,
            'transition-colors',
            'duration-300' // Reduced duration for better performance
          ];
          body.classList.add(...classesToAdd);
        },
        () => {
          // Update CSS custom properties
          const cssProperties = {
            '--theme-body-bg': theme.bodyBg,
            '--theme-header-bg': theme.headerBg,
            '--theme-card-bg': theme.cardBg,
            '--theme-text-primary': theme.textPrimary,
            '--theme-text-secondary': theme.textSecondary,
            '--theme-accent': theme.accent,
            '--theme-border': theme.border,
            '--theme-is-dramatic': theme.isDramatic ? '1' : '0'
          };

          Object.entries(cssProperties).forEach(([property, value]) => {
            root.style.setProperty(property, value);
          });
        }
      ]);
    });
  }, []);

  // Debounced theme application for better performance
  const debouncedApplyTheme = useMemo(
    () => debounce(applyThemeToDOM, 100),
    [applyThemeToDOM]
  );

  // Track navigation changes with optimized timing
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 150); // Reduced timeout
    return () => clearTimeout(timer);
  }, [pathname]);

  // Apply theme changes with performance optimization
  useEffect(() => {
    // Skip theme changes during navigation to prevent flickering
    if (isNavigating) return;
    
    debouncedApplyTheme(themeConfig);
  }, [isNavigating, themeConfig, debouncedApplyTheme]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending debounced calls
      debouncedApplyTheme.cancel();
    };
  }, [debouncedApplyTheme]);

  return <>{children}</>;
});

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