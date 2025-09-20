import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { createConfig, WagmiProvider, http } from 'wagmi';
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

const { connectors } = getDefaultWallets({
  appName: 'EcoHunt',
  projectId: 'ecohunt-farcaster-app',
});

const wagmiConfig = createConfig({
  chains: [zora],
  connectors,
  transports: {
    [zora.id]: http(),
  },
});

const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}