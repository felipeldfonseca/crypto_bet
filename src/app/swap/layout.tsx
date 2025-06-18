import { WalletContextProvider } from '@/components/providers/WalletContextProvider';

export default function SwapLayout({
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