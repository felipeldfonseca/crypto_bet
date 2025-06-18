import React from 'react';
import { CryptoBetLogo, LandingLogo, SwapLogo, StableLogo, DegenLogo } from '@/components/shared/CryptoBetLogo';
import { ContextAwareLogo } from '@/components/shared/ContextAwareLogo';

export default function LogoDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            CryptoBet Logo Showcase
          </h1>
          <p className="text-lg text-slate-600">
            Your Etna font + PNG icons implementation
          </p>
        </div>

        {/* Variant Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Landing Variant */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-slate-800">
              Landing Variant
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              "Crypto" in #0f172a + "Bet" in #ea580c
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm w-16">Small:</span>
                <LandingLogo size="small" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-16">Medium:</span>
                <LandingLogo size="medium" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-16">Large:</span>
                <LandingLogo size="large" />
              </div>
            </div>
          </div>

          {/* Swap Variant */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-slate-800">
              Swap Variant
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              "CryptoBet" in #ea580c
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm w-16">Small:</span>
                <SwapLogo size="small" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-16">Medium:</span>
                <SwapLogo size="medium" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-16">Large:</span>
                <SwapLogo size="large" />
              </div>
            </div>
          </div>

          {/* Stable Variant */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-slate-800">
              Stable Variant
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              "CryptoBet" in #0f172a
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm w-16">Small:</span>
                <StableLogo size="small" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-16">Medium:</span>
                <StableLogo size="medium" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-16">Large:</span>
                <StableLogo size="large" />
              </div>
            </div>
          </div>

          {/* Degen Variant */}
          <div className="bg-slate-900 rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-white">
              Degen Variant
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              "Crypto" in white + "Bet" in #ea580c
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm w-16 text-white">Small:</span>
                <DegenLogo size="small" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-16 text-white">Medium:</span>
                <DegenLogo size="medium" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-16 text-white">Large:</span>
                <DegenLogo size="large" />
              </div>
            </div>
          </div>
        </div>

        {/* Icon Showcase */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
          <h3 className="text-xl font-semibold mb-6 text-slate-800">
            Icon Styles (Medium Size)
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <CryptoBetLogo variant="landing" size="medium" iconStyle="dark" showIcon={true} />
              <p className="text-sm text-slate-600 mt-2">Dark</p>
            </div>
            <div className="text-center">
              <CryptoBetLogo variant="landing" size="medium" iconStyle="full_color" showIcon={true} />
              <p className="text-sm text-slate-600 mt-2">Full Color</p>
            </div>
            <div className="text-center">
              <CryptoBetLogo variant="landing" size="medium" iconStyle="navy" showIcon={true} />
              <p className="text-sm text-slate-600 mt-2">Navy</p>
            </div>
            <div className="text-center">
              <CryptoBetLogo variant="landing" size="medium" iconStyle="orange" showIcon={true} />
              <p className="text-sm text-slate-600 mt-2">Orange</p>
            </div>
          </div>
        </div>

        {/* Context Aware Demo */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-slate-800">
            Context-Aware Logo
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            This logo automatically changes based on the current page and betting mode.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm">Current Context:</span>
            <ContextAwareLogo size="medium" />
          </div>
        </div>

        {/* Technical Specs */}
        <div className="bg-slate-100 rounded-xl p-8 mt-12">
          <h3 className="text-xl font-semibold mb-6 text-slate-800">
            🎯 Implementation Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Font</h4>
              <p className="text-slate-600">Etna Sans Serif (etna-free-font.otf)</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Colors</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#0f172a] rounded"></div>
                  <span className="text-slate-600">Dark: #0f172a</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#ea580c] rounded"></div>
                  <span className="text-slate-600">Orange: #ea580c</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Icon Sizes</h4>
              <p className="text-slate-600">250×250px, 313×313px (auto-selected)</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Variants</h4>
              <p className="text-slate-600">Landing, Swap, Stable, Degen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 