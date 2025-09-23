import { Wallet, Link, AlertCircle, CheckCircle } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { BASE_CHAINS } from '../config/wagmi'

export function WalletConnection() {
  const {
    address,
    isConnected,
    isConnecting,
    chainId,
    connect,
    disconnect,
    switchToZora,
    switchToZoraTestnet,
    error
  } = useWallet()

  const isOnZora = chainId === BASE_CHAINS.mainnet.id
  const isOnZoraTestnet = chainId === BASE_CHAINS.testnet.id
  const isOnSupportedNetwork = isOnZora || isOnZoraTestnet

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Wallet className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Connect Wallet</h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Connect your wallet to earn and claim $GREEN tokens on Zora network.
          </p>

          <button
            onClick={connect}
            disabled={isConnecting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700">
                Failed to connect wallet. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Wallet className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Wallet Connected</h2>
        </div>
        <button
          onClick={disconnect}
          className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
        >
          Disconnect
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-gray-900">Wallet Address</p>
            <p className="text-sm text-gray-600 font-mono">{formatAddress(address!)}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-3">Network Status</h3>

          {isOnSupportedNetwork ? (
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">
                  Connected to {isOnZora ? 'Zora Mainnet' : 'Zora Testnet'}
                </p>
                <p className="text-sm text-gray-600">
                  Ready to earn $GREEN tokens!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-gray-900">Wrong Network</p>
                  <p className="text-sm text-gray-600">
                    Please switch to Zora network to earn tokens.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={switchToZora}
                  className="flex items-center justify-center space-x-2 bg-eco hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition-colors"
                >
                  <Link className="w-4 h-4" />
                  <span>Zora Mainnet</span>
                </button>
                <button
                  onClick={switchToZoraTestnet}
                  className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg transition-colors"
                >
                  <Link className="w-4 h-4" />
                  <span>Zora Testnet</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-2">Supported Networks</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Zora Mainnet (Chain ID: {BASE_CHAINS.mainnet.id})</li>
            <li>• Zora Testnet (Chain ID: {BASE_CHAINS.testnet.id})</li>
          </ul>
        </div>
      </div>
    </div>
  )
}