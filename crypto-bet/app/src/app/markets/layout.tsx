import { WalletContextProvider } from '@/components/providers/WalletContextProvider';
import { Header } from '@/components/layout/Header';

export default function MarketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletContextProvider>
      <Header showWalletButton={true} />
      <main className="flex flex-col items-center">
        {children}
      </main>
    </WalletContextProvider>
  );
} 