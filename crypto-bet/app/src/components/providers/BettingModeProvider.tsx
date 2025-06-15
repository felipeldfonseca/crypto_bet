'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TokenType } from '@/lib/jupiter';

export type BettingMode = 'degen' | 'stable';

interface BettingModeContextType {
  mode: BettingMode;
  preferredToken: TokenType;
  setMode: (mode: BettingMode) => void;
  toggleMode: () => void;
  getTokenForMode: () => TokenType;
  getModeConfig: () => ModeConfig;
}

interface ModeConfig {
  name: string;
  description: string;
  token: TokenType;
  icon: string;
  color: string;
  bgColor: string;
  features: string[];
  // Dramatic theming properties
  isDramatic: boolean;
  bodyBg: string;
  headerBg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  border: string;
}

const MODE_CONFIGS: Record<BettingMode, ModeConfig> = {
  degen: {
    name: 'Degen Mode',
    description: 'High-volatility betting with SOL',
    token: 'SOL',
    icon: '🚀',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200',
    features: [
      'Native SOL betting',
      'Higher potential returns',
      'Price volatility exposure',
      'Fast transaction settlements'
    ],
    // Dramatic dark theme
    isDramatic: true,
    bodyBg: 'bg-slate-900',
    headerBg: 'bg-slate-800/90',
    cardBg: 'bg-slate-800/50',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    accent: 'text-orange-500',
    border: 'border-slate-700'
  },
  stable: {
    name: 'Stable Mode',
    description: 'Stable value betting with USDC',
    token: 'USDC',
    icon: '🏦',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    features: [
      'USD-pegged USDC betting',
      'Predictable value',
      'Inflation protection',
      'Traditional finance feel'
    ],
    // Light theme (existing)
    isDramatic: false,
    bodyBg: 'bg-white',
    headerBg: 'bg-white/90',
    cardBg: 'bg-white',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'text-blue-600',
    border: 'border-gray-200'
  }
};

const BettingModeContext = createContext<BettingModeContextType | undefined>(undefined);

interface BettingModeProviderProps {
  children: ReactNode;
  defaultMode?: BettingMode;
}

export function BettingModeProvider({ 
  children, 
  defaultMode = 'degen' 
}: BettingModeProviderProps) {
  const [mode, setModeState] = useState<BettingMode>(defaultMode);

  const setMode = useCallback((newMode: BettingMode) => {
    setModeState(newMode);
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('betting-mode', newMode);
    }
  }, []);

  const toggleMode = useCallback(() => {
    const newMode = mode === 'degen' ? 'stable' : 'degen';
    setMode(newMode);
  }, [mode, setMode]);

  const getTokenForMode = useCallback((): TokenType => {
    return MODE_CONFIGS[mode].token;
  }, [mode]);

  const getModeConfig = useCallback((): ModeConfig => {
    return MODE_CONFIGS[mode];
  }, [mode]);

  // Initialize mode from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('betting-mode') as BettingMode;
      if (storedMode && (storedMode === 'degen' || storedMode === 'stable')) {
        setModeState(storedMode);
      }
      
      // Check URL params for mode setting
      const urlParams = new URLSearchParams(window.location.search);
      const urlMode = urlParams.get('mode') as BettingMode;
      if (urlMode && (urlMode === 'degen' || urlMode === 'stable')) {
        setMode(urlMode);
      }
    }
  }, [setMode]);

  const value: BettingModeContextType = {
    mode,
    preferredToken: getTokenForMode(),
    setMode,
    toggleMode,
    getTokenForMode,
    getModeConfig,
  };

  return (
    <BettingModeContext.Provider value={value}>
      {children}
    </BettingModeContext.Provider>
  );
}

export function useBettingMode() {
  const context = useContext(BettingModeContext);
  if (context === undefined) {
    throw new Error('useBettingMode must be used within a BettingModeProvider');
  }
  return context;
}

// Export mode configurations for external use
export { MODE_CONFIGS };
export type { ModeConfig }; 