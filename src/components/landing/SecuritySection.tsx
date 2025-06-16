import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';

// Memoized security feature component
const SecurityFeature = React.memo<{
  icon: React.ReactNode;
  title: string;
  description: string;
}>(function SecurityFeature({ icon, title, description }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-full bg-blue-500/10">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
});

export const SecuritySection = React.memo(function SecuritySection() {
  return (
    <section className="w-full py-16 bg-muted/30">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Built for Trust.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Every bet, every payout, every market resolution is recorded on-chain. No black boxes, no hidden fees, no counterparty risk.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <SecurityFeature
            icon={<Shield className="h-8 w-8 text-blue-500" />}
            title="Non-Custodial"
            description="Your funds never leave your wallet until you place a bet. Win or lose, payouts are automatic and instant."
          />
          
          <SecurityFeature
            icon={<Eye className="h-8 w-8 text-blue-500" />}
            title="Fully Transparent"
            description="All market data, odds calculations, and resolution criteria are public and verifiable on the Solana blockchain."
          />
          
          <SecurityFeature
            icon={<Lock className="h-8 w-8 text-blue-500" />}
            title="Immutable Rules"
            description="Smart contract logic ensures fair payouts and prevents manipulation. Code is law, not house rules."
          />
        </div>
      </div>
    </section>
  );
}); 