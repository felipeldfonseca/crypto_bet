import React from 'react';

export const ValuePropSection = React.memo(function ValuePropSection() {
  return (
    <section className="w-full py-16 bg-muted/30">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Crypto Bet in a Nutshell.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            One‑tap prediction markets for the crypto conversation. Bet on tokens, narratives, and trending memes. No casinos, no sportsbooks, just pure on‑chain signal.
          </p>
        </div>
      </div>
    </section>
  );
}); 