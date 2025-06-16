import React from 'react';

export const Footer = React.memo(function Footer() {
  return (
    <footer className="w-full py-8 border-t bg-muted/30">
      <div className="container mx-auto w-full max-w-[1120px] px-6 md:px-10">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 Crypto Bet. Built on Solana.</p>
        </div>
      </div>
    </footer>
  );
}); 