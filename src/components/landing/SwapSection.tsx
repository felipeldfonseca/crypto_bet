import React from 'react';
import { ArrowLeftRight, ArrowUpDown, Coins } from 'lucide-react';

// Memoized token display component
const TokenDisplay = React.memo<{
  icon: React.ReactNode;
  name: string;
  amount: string;
  bgColor: string;
}>(function TokenDisplay({ icon, name, amount, bgColor }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
        <span className="font-medium">{name}</span>
      </div>
      <span className="text-2xl font-bold">{amount}</span>
    </div>
  );
});

// Memoized swap visual component
const SwapVisual = React.memo(function SwapVisual() {
  return (
    <div className="relative">
      {/* Main swap visual */}
      <div className="bg-background rounded-xl p-8 shadow-lg border">
        <TokenDisplay
          icon={<span className="text-white font-bold text-sm">SOL</span>}
          name="Solana"
          amount="1.25"
          bgColor="bg-orange-500"
        />
        
        <div className="flex justify-center my-4">
          <div className="p-2 rounded-full bg-blue-500/10">
            <ArrowUpDown className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        
        <TokenDisplay
          icon={<Coins className="h-4 w-4 text-white" />}
          name="USDC"
          amount="287.50"
          bgColor="bg-blue-500"
        />
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        Best Rate
      </div>
      <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        Jupiter
      </div>
    </div>
  );
});

// Memoized feature indicator component
const FeatureIndicator = React.memo<{
  color: string;
  text: string;
}>(function FeatureIndicator({ color, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 ${color} rounded-full`}></div>
      <span>{text}</span>
    </div>
  );
});

export const SwapSection = React.memo(function SwapSection() {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Visual Left Side */}
            <div className="flex justify-center">
              <SwapVisual />
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
                <FeatureIndicator color="bg-green-500" text="Real-time rates" />
                <FeatureIndicator color="bg-blue-500" text="Minimal slippage" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}); 