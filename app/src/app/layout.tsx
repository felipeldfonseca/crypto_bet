import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/components/providers/WalletContextProvider";
import { WalletConnectButton } from "@/components/shared/WalletConnectButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Bet",
  description: "A speculative intelligence hub for the cryptocurrency market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WalletContextProvider>
          <header className="p-4 flex justify-between items-center border-b">
            <h1 className="text-2xl font-bold">Crypto Bet</h1>
            <WalletConnectButton />
          </header>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
} 