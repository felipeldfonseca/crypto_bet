'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { etnaFont } from '@/assets/fonts/etna';

// Import icon assets
import cryptobetDarkIcon250 from '@/assets/icons/250x250/cryptobet_dark_icon.png';
import cryptobetFullColorIcon250 from '@/assets/icons/250x250/cryptobet_full_color_icon.png';
import cryptobetNavyIcon250 from '@/assets/icons/250x250/cryptobet_navy_icon.png';
import cryptobetOrangeIcon250 from '@/assets/icons/250x250/cryptobet_orange_icon.png';
import cryptobetDarkIcon313 from '@/assets/icons/313x313/cryptobet_dark_icon.png';
import cryptobetFullColorIcon313 from '@/assets/icons/313x313/cryptobet_full_color_icon.png';
import cryptobetNavyIcon313 from '@/assets/icons/313x313/cryptobet_navy_icon.png';
import cryptobetOrangeIcon313 from '@/assets/icons/313x313/cryptobet_orange_icon.png';

export type LogoVariant = 'landing' | 'swap' | 'stable' | 'degen';
export type LogoSize = 'small' | 'medium' | 'large';
export type IconStyle = 'dark' | 'full_color' | 'navy' | 'orange';

interface CryptoBetLogoProps {
  variant: LogoVariant;
  size?: LogoSize;
  iconStyle?: IconStyle;
  className?: string;
  href?: string;
  showIcon?: boolean;
}

const SIZE_CONFIGS = {
  small: {
    iconSize: 40,
    fontSize: '1.25rem',
    gap: '0.375rem',
  },
  medium: {
    iconSize: 60,
    fontSize: '1.875rem',
    gap: '0.5625rem',
  },
  large: {
    iconSize: 80,
    fontSize: '2.5rem',
    gap: '0.75rem',
  },
};

const VARIANT_CONFIGS = {
  landing: {
    cryptoColor: '#0f172a',
    betColor: '#ea580c',
    split: true,
    defaultIconStyle: 'full_color' as IconStyle,
  },
  swap: {
    cryptoColor: '#ea580c',
    betColor: '#ea580c',
    split: false,
    defaultIconStyle: 'orange' as IconStyle,
  },
  stable: {
    cryptoColor: '#0f172a',
    betColor: '#0f172a',
    split: false,
    defaultIconStyle: 'navy' as IconStyle,
  },
  degen: {
    cryptoColor: '#ffffff',
    betColor: '#ea580c',
    split: true,
    defaultIconStyle: 'dark' as IconStyle,
  },
};

const getIconSource = (iconStyle: IconStyle, size: LogoSize) => {
  const useHighRes = size === 'large';
  const iconMap = useHighRes ? {
    dark: cryptobetDarkIcon313,
    full_color: cryptobetFullColorIcon313,
    navy: cryptobetNavyIcon313,
    orange: cryptobetOrangeIcon313,
  } : {
    dark: cryptobetDarkIcon250,
    full_color: cryptobetFullColorIcon250,
    navy: cryptobetNavyIcon250,
    orange: cryptobetOrangeIcon250,
  };
  
  return iconMap[iconStyle];
};

const LogoContent: React.FC<CryptoBetLogoProps> = ({
  variant,
  size = 'medium',
  iconStyle,
  className = '',
  showIcon = true,
}) => {
  const sizeConfig = SIZE_CONFIGS[size];
  const variantConfig = VARIANT_CONFIGS[variant];
  const finalIconStyle = iconStyle || variantConfig.defaultIconStyle;
  const iconSource = getIconSource(finalIconStyle, size);

  return (
    <div 
      className={cn(
        'flex items-center',
        etnaFont.className,
        className
      )}
      style={{
        gap: sizeConfig.gap,
        fontWeight: 'bold',
      }}
    >
      {/* Icon */}
      {showIcon && (
        <Image
          src={iconSource}
          alt="CryptoBet Icon"
          width={sizeConfig.iconSize}
          height={sizeConfig.iconSize}
          className="flex-shrink-0"
          priority
        />
      )}
      
      {/* Text */}
      <div 
        className="select-none"
        style={{
          fontSize: sizeConfig.fontSize,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {variantConfig.split ? (
          <>
            <span style={{ color: variantConfig.cryptoColor }}>Crypto</span>
            <span style={{ color: variantConfig.betColor }}>Bet</span>
          </>
        ) : (
          <span style={{ color: variantConfig.cryptoColor }}>CryptoBet</span>
        )}
      </div>
    </div>
  );
};

export const CryptoBetLogo: React.FC<CryptoBetLogoProps> = (props) => {
  const { href = '/', ...logoProps } = props;

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        <LogoContent {...logoProps} />
      </Link>
    );
  }

  return <LogoContent {...logoProps} />;
};

// Convenience components for specific variants
export const LandingLogo: React.FC<Omit<CryptoBetLogoProps, 'variant'>> = (props) => (
  <CryptoBetLogo variant="landing" {...props} />
);

export const SwapLogo: React.FC<Omit<CryptoBetLogoProps, 'variant'>> = (props) => (
  <CryptoBetLogo variant="swap" {...props} />
);

export const StableLogo: React.FC<Omit<CryptoBetLogoProps, 'variant'>> = (props) => (
  <CryptoBetLogo variant="stable" {...props} />
);

export const DegenLogo: React.FC<Omit<CryptoBetLogoProps, 'variant'>> = (props) => (
  <CryptoBetLogo variant="degen" {...props} />
);

export default CryptoBetLogo; 