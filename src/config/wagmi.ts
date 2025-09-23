import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

export const BASE_CHAINS = {
  mainnet: base,
  testnet: baseSepolia,
} as const