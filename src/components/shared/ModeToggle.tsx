'use client';

import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useBettingMode } from '@/components/providers/BettingModeProvider';
import { Shield, TrendingUp } from 'lucide-react';

interface ModeToggleProps {
  className?: string;
  showInfo?: boolean;
}

// Memoized mode button component
const ModeButton = React.memo<{
  isActive: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}>(function ModeButton({ isActive, icon, title, description, onClick }) {
  const buttonClasses = useMemo(() => cn(
    "flex flex-col items-center gap-2 p-4 h-auto transition-all duration-200",
    isActive 
      ? "bg-primary text-primary-foreground shadow-md" 
      : "bg-muted hover:bg-muted/80"
  ), [isActive]);

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={onClick}
      className={buttonClasses}
    >
      {icon}
      <div className="text-center">
        <div className="font-semibold">{title}</div>
        <div className="text-xs opacity-80">{description}</div>
      </div>
    </Button>
  );
});

export const ModeToggle = React.memo<ModeToggleProps>(function ModeToggle({
  className,
  showInfo = true
}) {
  const { mode, setMode, getModeConfig } = useBettingMode();
  const modeConfig = getModeConfig();

  // Memoized mode handlers
  const handleStableMode = useCallback(() => {
    setMode('stable');
  }, [setMode]);

  const handleDegenMode = useCallback(() => {
    setMode('degen');
  }, [setMode]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-2 gap-4">
        <ModeButton
          isActive={mode === 'stable'}
          icon={<Shield className="h-6 w-6" />}
          title="Stable"
          description="USDC betting"
          onClick={handleStableMode}
        />
        
        <ModeButton
          isActive={mode === 'degen'}
          icon={<TrendingUp className="h-6 w-6" />}
          title="Degen"
          description="SOL betting"
          onClick={handleDegenMode}
        />
      </div>

      {showInfo && (
        <div className="text-center">
          <Badge variant="outline" className={modeConfig.color}>
            Current: {modeConfig.name} Mode ({modeConfig.token})
          </Badge>
        </div>
      )}
    </div>
  );
});

interface ModeInfoCardProps {
  className?: string;
}

export const ModeInfoCard = React.memo<ModeInfoCardProps>(function ModeInfoCard({ 
  className 
}) {
  const { mode, getModeConfig } = useBettingMode();
  const config = getModeConfig();

  // Memoized card content
  const cardContent = useMemo(() => ({
    stable: {
      title: "Stable Mode Active",
      description: "You're betting with USDC for predictable, stable wagering.",
      benefits: [
        "No token volatility risk",
        "Predictable bet values",
        "Perfect for conservative trading"
      ]
    },
    degen: {
      title: "Degen Mode Active", 
      description: "You're betting with SOL for maximum upside potential.",
      benefits: [
        "Winnings compound with SOL price",
        "Higher potential returns",
        "Double down on conviction"
      ]
    }
  }), []);

  const currentContent = cardContent[mode];

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-xl">{config.icon}</span>
          {currentContent.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {currentContent.description}
        </p>
        <div className="space-y-1">
          {currentContent.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

interface CompactModeToggleProps {
  className?: string;
}

export const CompactModeToggle = React.memo<CompactModeToggleProps>(function CompactModeToggle({ 
  className 
}) {
  const { mode, toggleMode, getModeConfig } = useBettingMode();
  const config = getModeConfig();

  // Memoized toggle handler
  const handleToggle = useCallback(() => {
    toggleMode();
  }, [toggleMode]);

  // Memoized button classes
  const buttonClasses = useMemo(() => cn(
    "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors",
    config.color,
    className
  ), [config.color, className]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className={buttonClasses}
    >
      <span className="text-base">{config.icon}</span>
      <span>{config.name}</span>
      <Badge variant="secondary" className="text-xs">
        {config.token}
      </Badge>
    </Button>
  );
}); 