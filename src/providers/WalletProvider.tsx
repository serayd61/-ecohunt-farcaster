import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';

// Zora Network Configuration
const zora = defineChain({
  id: 7777777,
  name: 'Zora',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://rpc.zora.energy'] },
  },
  blockExplorers: {
    default: { name: 'Zora Explorer', url: 'https://explorer.zora.energy' },
  },
});

const config = getDefaultConfig({
  appName: 'EcoHunt',
  projectId: 'ecohunt-farcaster-app',
  chains: [zora],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}