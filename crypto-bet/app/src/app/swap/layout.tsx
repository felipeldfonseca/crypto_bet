import { Header } from '@/components/layout/Header';
import { WalletContextProvider } from '@/components/providers/WalletContextProvider';

export default function SwapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletContextProvider>
      <Header />
      <main>{children}</main>
    </WalletContextProvider>
  );
} 