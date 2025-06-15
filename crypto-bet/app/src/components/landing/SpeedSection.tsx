import React from 'react';
import { Zap } from 'lucide-react';

export const SpeedSection: React.FC = () => {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-orange-500/10">
              <Zap className="h-12 w-12 text-orange-500" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Blink‑and‑it's‑done.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            ≈400 ms finality, fees that round down to zero, and rewards you can claim at any time. Payout rights never expire.
          </p>
        </div>
      </div>
    </section>
  );
}; 