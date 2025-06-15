import { WalletContextProvider } from '@/components/providers/WalletContextProvider';
import { Header } from '@/components/layout/Header';

export default function SwapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletContextProvider>
      <Header 
        showWalletButton={true} 
        showModeToggle={false} 
        showNavigation={true}
        layout="app" 
      />
      <main className="flex flex-col items-center">
        {children}
      </main>
    </WalletContextProvider>
  );
} 