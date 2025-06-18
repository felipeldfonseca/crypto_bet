import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BettingModeProvider } from "@/components/providers/BettingModeProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { WalletContextProvider } from "@/components/providers/WalletContextProvider";
import { Header } from "@/components/layout/Header";
import { etnaFont } from "@/assets/fonts/etna";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Bet - Solana Prediction Markets",
  description: "Fast, on-chain crypto betting on Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${etnaFont.variable}`}>
        <BettingModeProvider>
          <ThemeProvider>
            <WalletContextProvider>
              <Header />
              {children}
            </WalletContextProvider>
          </ThemeProvider>
        </BettingModeProvider>
      </body>
    </html>
  );
} 