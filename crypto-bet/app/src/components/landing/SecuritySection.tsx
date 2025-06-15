import React from 'react';
import { Shield, CheckCircle, Bug, Search } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        <div className="bg-muted/30 rounded-2xl p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Visual Left Side */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Main security visual - more compact dimensions */}
                <div className="bg-background rounded-xl p-6 shadow-lg border" style={{width: '240px', height: '260px'}}>
                  <div className="flex flex-col h-full justify-center">
                    <div className="text-center">
                      <div className="inline-flex p-4 rounded-full bg-purple-500/10 mb-6">
                        <Shield className="h-20 w-20 text-purple-500" />
                      </div>
                      <h3 className="font-bold text-2xl">Security Status</h3>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Audited
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </div>
              </div>
            </div>

            {/* Content Right Side */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built to Withstand.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Independent audits, live bug bounty, and layered oracle defense. Security isn't a feature — it's the baseline.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Audit Partners</span>
                  <span className="text-muted-foreground">Trail of Bits, Consensys</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Bug Bounty</span>
                  <span className="text-muted-foreground">Up to $50,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 