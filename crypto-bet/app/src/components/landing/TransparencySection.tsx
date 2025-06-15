import React from 'react';
import { Eye, Code, Shield, GitBranch, FileCode } from 'lucide-react';

export const TransparencySection: React.FC = () => {
  return (
    <section className="w-full py-16 bg-muted/30">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        <div className="bg-background rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content Left Side */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Yours from Block 1.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Smart contracts hold the funds, not us. Open‑source code, public odds math, and immutable on‑chain records keep every bet accountable.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Code className="h-4 w-4 text-green-500" />
                  <span>Open-source smart contracts</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span>Public odds calculation</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Immutable on-chain records</span>
                </div>
              </div>
            </div>

            {/* Visual Right Side */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Main contract visual - matching swap card dimensions */}
                <div className="bg-background rounded-xl p-8 shadow-lg border" style={{width: '280px', height: '320px'}}>
                  <div className="flex flex-col h-full justify-center items-center">
                    <div className="flex-1 flex flex-col justify-center items-center">
                      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                        <div className="text-green-500 font-mono text-2xl font-bold">
                          {'</>'}
                        </div>
                      </div>
                      <h3 className="font-bold text-2xl text-center">Smart Contract</h3>
                    </div>
                    
                    <div className="text-center pt-4 border-t w-full">
                      <span className="text-sm text-muted-foreground font-mono">
                        0x7a2f...8b4c
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <GitBranch className="h-3 w-3" />
                  Open Source
                </div>
                <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 