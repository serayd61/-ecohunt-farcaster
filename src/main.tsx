import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { sdk } from '@farcaster/miniapp-sdk'
import { farcasterSDK } from './utils/farcaster'
import { WalletProvider } from './providers/WalletProvider'

function AppWithFarcaster() {
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Call ready() when interface is fully loaded (per guide)
        await sdk.actions.ready()
        console.log('✅ Farcaster SDK ready() called')

        // Initialize our context wrapper
        await farcasterSDK.initialize()
        console.log('✅ EcoHunt SDK initialization complete')
      } catch (error) {
        console.error('❌ Error initializing SDK:', error)
      }
    }

    initializeSDK()
  }, [])

  return (
    <WalletProvider>
      <App />
    </WalletProvider>
  )
}

// Remove StrictMode to avoid double initialization
createRoot(document.getElementById('root')!).render(
  <AppWithFarcaster />
)
