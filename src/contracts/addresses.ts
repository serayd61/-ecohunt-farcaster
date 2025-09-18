export const CONTRACT_ADDRESSES = {
  // Zora Network Contract Addresses
  ZORA_MAINNET: {
    GREEN_TOKEN: '0x...',
    ECO_NFT: '0x...',
    ECO_HUNT_CORE: '0x...',
  },
  ZORA_TESTNET: {
    GREEN_TOKEN: '0x...',
    ECO_NFT: '0x...',
    ECO_HUNT_CORE: '0x...',
  }
} as const

export const NETWORK_CONFIG = {
  ZORA_MAINNET: {
    chainId: 7777777,
    name: 'Zora',
    currency: 'ETH',
    rpcUrl: 'https://rpc.zora.energy',
    blockExplorer: 'https://explorer.zora.energy',
  },
  ZORA_TESTNET: {
    chainId: 999999999,
    name: 'Zora Testnet',
    currency: 'ETH', 
    rpcUrl: 'https://testnet.rpc.zora.energy',
    blockExplorer: 'https://testnet.explorer.zora.energy',
  }
} as const

export const getContractAddress = (contract: keyof typeof CONTRACT_ADDRESSES.ZORA_MAINNET, isTestnet = false) => {
  return isTestnet 
    ? CONTRACT_ADDRESSES.ZORA_TESTNET[contract]
    : CONTRACT_ADDRESSES.ZORA_MAINNET[contract]
}