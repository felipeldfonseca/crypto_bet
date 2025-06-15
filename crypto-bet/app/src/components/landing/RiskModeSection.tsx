import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, TrendingUp } from 'lucide-react';

export const RiskModeSection: React.FC = () => {
  return (
    <section className="w-full py-16 bg-muted/30">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Choose Your Risk.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Stable Mode */}
          <Card className="p-8">
            <CardContent className="pt-0">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-blue-500" />
                <h3 className="text-2xl font-bold">Stable</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                <span className="font-medium">Steady staking & risk management</span>
              </p>
              <p className="text-muted-foreground">
                USDC pools, tighter spreads, capital preservation.
              </p>
            </CardContent>
          </Card>

          {/* Degen Mode */}
          <Card className="p-8">
            <CardContent className="pt-0">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <h3 className="text-2xl font-bold">Degen</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                <span className="font-medium">High-voltage speculation</span>
              </p>
              <p className="text-muted-foreground">
                Native SOL pools, bigger swings, higher ceilings.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground italic">
            *Switch any time; odds update live with every new bet—your exposure travels with you.
          </p>
        </div>
      </div>
    </section>
  );
}; 