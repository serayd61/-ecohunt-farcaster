export const CONTRACT_ADDRESSES = {
  // Base Network Contract Addresses
  BASE_MAINNET: {
    GREEN_TOKEN: '0x9a32Ea4E421bc93a1b2Ce050dA3e6426626b0627',
    ECO_NFT: '0x894edd96b8ca4a25787d9e50fc73c7120d2acdc9',
    ECO_HUNT_CORE: '0x498BD864F86a362dc978Dc99D3D1d540c8644349',
  },
  BASE_SEPOLIA: {
    GREEN_TOKEN: '0x...',
    ECO_NFT: '0x...',
    ECO_HUNT_CORE: '0x...',
  }
} as const

export const NETWORK_CONFIG = {
  BASE_MAINNET: {
    chainId: 8453,
    name: 'Base',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
  },
  BASE_SEPOLIA: {
    chainId: 84532,
    name: 'Base Sepolia',
    currency: 'ETH', 
    rpcUrl: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org',
  }
} as const

export const getContractAddress = (contract: keyof typeof CONTRACT_ADDRESSES.BASE_MAINNET, isTestnet = false) => {
  return isTestnet 
    ? CONTRACT_ADDRESSES.BASE_SEPOLIA[contract]
    : CONTRACT_ADDRESSES.BASE_MAINNET[contract]
}