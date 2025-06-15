import React from 'react';
import { ArrowLeftRight, ArrowUpDown, Coins } from 'lucide-react';

export const SwapSection: React.FC = () => {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Visual Left Side */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Main swap visual */}
                <div className="bg-background rounded-xl p-8 shadow-lg border">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">SOL</span>
                      </div>
                      <span className="font-medium">Solana</span>
                    </div>
                    <span className="text-2xl font-bold">1.25</span>
                  </div>
                  
                  <div className="flex justify-center my-4">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <ArrowUpDown className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Coins className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">USDC</span>
                    </div>
                    <span className="text-2xl font-bold">287.50</span>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Best Rate
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Jupiter
                </div>
              </div>
            </div>

            {/* Content Right Side */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Swap Without Leaving.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Built‑in Jupiter integration lets you convert any supported token straight to SOL or USDC — lock your bet before the moment passes.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Real-time rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Minimal slippage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 