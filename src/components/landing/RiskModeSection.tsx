import React from 'react';
import { Badge } from '@/components/ui/badge';

// Memoized mode card component
const ModeCard = React.memo<{
  icon: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
}>(function ModeCard({ icon, title, description, badge, badgeColor }) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <Badge variant="outline" className={badgeColor}>
            {badge}
          </Badge>
        </div>
      </div>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
});

export const RiskModeSection = React.memo(function RiskModeSection() {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Choose Your Risk Mode.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Switch between stable and degen modes to match your risk appetite. Same markets, different tokens.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <ModeCard
            icon="🛡️"
            title="Stable Mode"
            description="Bet with USDC for predictable, stable wagering. Perfect for conservative traders who want exposure to prediction markets without token volatility."
            badge="USDC"
            badgeColor="text-green-600 border-green-200"
          />
          
          <ModeCard
            icon="🚀"
            title="Degen Mode"
            description="Bet with SOL for maximum upside potential. Your winnings compound with SOL price appreciation — double down on your conviction."
            badge="SOL"
            badgeColor="text-purple-600 border-purple-200"
          />
        </div>
      </div>
    </section>
  );
}); 