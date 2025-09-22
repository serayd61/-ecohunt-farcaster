import { createContext, useContext, type ReactNode, useState } from 'react'
import { farcasterSDK } from '../utils/farcaster'
import { BASE_CHAINS } from '../config/wagmi'

interface WalletContextType {
  address: string | undefined
  isConnected: boolean
  isConnecting: boolean
  chainId: number | undefined
  connect: () => Promise<void>
  disconnect: () => void
  switchToZora: () => Promise<void>
  switchToZoraTestnet: () => Promise<void>
  error: Error | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | undefined>()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<number | undefined>()
  const [error, setError] = useState<Error | null>(null)

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      if (farcasterSDK.isInitialized()) {
        const provider = await farcasterSDK.getEthereumProvider()
        if (provider) {
          const accounts = await provider.request({ method: 'eth_requestAccounts' })
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)

            const network = await provider.request({ method: 'eth_chainId' })
            setChainId(parseInt(network, 16))
          }
        }
      } else {
        throw new Error('Farcaster SDK not initialized')
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Connection failed'))
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setAddress(undefined)
    setIsConnected(false)
    setChainId(undefined)
    setError(null)
  }

  const switchToZora = async () => {
    try {
      if (farcasterSDK.isInitialized()) {
        const provider = await farcasterSDK.getEthereumProvider()
        if (provider) {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${BASE_CHAINS.mainnet.id.toString(16)}` }],
          })
          setChainId(BASE_CHAINS.mainnet.id)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to switch network'))
    }
  }

  const switchToZoraTestnet = async () => {
    try {
      if (farcasterSDK.isInitialized()) {
        const provider = await farcasterSDK.getEthereumProvider()
        if (provider) {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${BASE_CHAINS.testnet.id.toString(16)}` }],
          })
          setChainId(BASE_CHAINS.testnet.id)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to switch network'))
    }
  }

  return (
    <WalletContext.Provider value={{
      address,
      isConnected,
      isConnecting,
      chainId,
      connect: handleConnect,
      disconnect: handleDisconnect,
      switchToZora,
      switchToZoraTestnet,
      error,
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}