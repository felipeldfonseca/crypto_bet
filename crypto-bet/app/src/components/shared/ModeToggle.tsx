'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useBettingMode, MODE_CONFIGS } from '@/components/providers/BettingModeProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/utils';

interface ModeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function ModeToggle({ 
  className,
  size = 'md',
  showLabels = true 
}: ModeToggleProps) {
  const { mode, toggleMode, getModeConfig } = useBettingMode();
  const currentConfig = getModeConfig();
  const theme = useTheme();
  
  const sizeClasses = {
    sm: 'h-8 text-xs px-3',
    md: 'h-10 text-sm px-4',
    lg: 'h-12 text-base px-6'
  };

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Mode Toggle Button */}
      <Button
        onClick={toggleMode}
        variant="outline"
        size="sm"
        className={cn(
          'relative transition-all duration-300 border-2 font-medium',
          currentConfig.bgColor,
          currentConfig.color,
          sizeClasses[size],
          'hover:shadow-md active:scale-95'
        )}
      >
        <span className="flex items-center gap-2">
          <span className="text-base">{currentConfig.icon}</span>
          {showLabels && (
            <span className="font-semibold">
              {currentConfig.name}
            </span>
          )}
        </span>
      </Button>

      {/* Mode Indicator Pills */}
      <div className="hidden sm:flex items-center gap-1">
        {Object.entries(MODE_CONFIGS).map(([modeKey, config]) => (
          <div
            key={modeKey}
            className={cn(
              'h-2 w-8 rounded-full transition-all duration-300',
              mode === modeKey 
                ? (theme.isDramatic ? 'bg-orange-500' : 'bg-slate-800')
                : 'bg-gray-200'
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface ModeInfoCardProps {
  className?: string;
}

export function ModeInfoCard({ className }: ModeInfoCardProps) {
  const { getModeConfig } = useBettingMode();
  const config = getModeConfig();

  return (
    <div className={cn(
      'p-4 rounded-lg border transition-all duration-300',
      config.bgColor,
      className
    )}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{config.icon}</span>
        <div>
          <h3 className={cn('font-bold text-lg', config.color)}>
            {config.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {config.description}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Features:</p>
        <ul className="space-y-1">
          {config.features.map((feature, index) => (
            <li key={index} className="text-sm flex items-center gap-2">
              <span className="w-1 h-1 bg-current rounded-full opacity-60" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface CompactModeToggleProps {
  className?: string;
}

export function CompactModeToggle({ className }: CompactModeToggleProps) {
  const { mode, toggleMode } = useBettingMode();
  const theme = useTheme();
  
  return (
    <button
      onClick={toggleMode}
      className={cn(
        'relative w-14 h-7 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg',
        mode === 'degen' 
          ? 'bg-orange-500 focus:ring-orange-500 shadow-orange-500/20' 
          : 'bg-slate-800 focus:ring-slate-800 shadow-slate-800/20',
        theme.isDramatic && 'ring-offset-slate-900',
        className
      )}
      aria-label={`Switch to ${mode === 'degen' ? 'stable' : 'degen'} mode`}
    >
      <span
        className={cn(
          'absolute left-1 top-1 w-5 h-5 rounded-full transition-all duration-500 flex items-center justify-center text-xs shadow-md',
          mode === 'stable' && 'transform translate-x-7',
          theme.isDramatic ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'
        )}
      >
        {mode === 'degen' ? '🚀' : '🏦'}
      </span>
    </button>
  );
} 