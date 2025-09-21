import { http, createConfig } from 'wagmi'
import { zora, zoraTestnet } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [zora, zoraTestnet],
  connectors: [],
  transports: {
    [zora.id]: http(),
    [zoraTestnet.id]: http(),
  },
})

export const ZORA_CHAINS = {
  mainnet: zora,
  testnet: zoraTestnet,
} as const