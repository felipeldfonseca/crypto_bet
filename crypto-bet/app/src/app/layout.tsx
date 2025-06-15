import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BettingModeProvider } from "@/components/providers/BettingModeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Bet - Fast On-Chain Crypto Betting",
  description: "Decimal odds, classic bet-slip and real-time market stats — built for speed on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BettingModeProvider>
          {children}
        </BettingModeProvider>
      </body>
    </html>
  );
} 