'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useBettingMode } from '@/components/providers/BettingModeProvider';
import { CryptoBetLogo, LandingLogo, SwapLogo, StableLogo, DegenLogo } from './CryptoBetLogo';
import type { LogoVariant, LogoSize, IconStyle } from './CryptoBetLogo';

interface ContextAwareLogoProps {
  size?: LogoSize;
  iconStyle?: IconStyle;
  className?: string;
  href?: string;
  showIcon?: boolean;
  forceVariant?: LogoVariant;
}

export const ContextAwareLogo: React.FC<ContextAwareLogoProps> = ({
  forceVariant,
  ...props
}) => {
  const pathname = usePathname();
  const { mode } = useBettingMode();

  // Determine variant based on context
  const getVariant = (): LogoVariant => {
    if (forceVariant) return forceVariant;
    
    // Route-based variants
    if (pathname.startsWith('/swap')) return 'swap';
    if (pathname.startsWith('/markets')) {
      // Use betting mode for markets
      return mode === 'degen' ? 'degen' : 'stable';
    }
    
    // Default to landing for home and other pages
    return 'landing';
  };

  const variant = getVariant();
  
  return <CryptoBetLogo variant={variant} {...props} />;
};

export default ContextAwareLogo; 