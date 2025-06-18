import { WalletContextProvider } from '@/components/providers/WalletContextProvider';

export default function MarketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletContextProvider>
      <main>{children}</main>
    </WalletContextProvider>
  );
} 