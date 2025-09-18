import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { sdk } from '@farcaster/miniapp-sdk'
import { farcasterSDK } from './utils/farcaster'

function AppWithFarcaster() {
  useEffect(() => {
    // Initialize Farcaster SDK immediately
    const initializeSDK = async () => {
      try {
        // Step 1: Call ready() to remove splash screen
        await sdk.actions.ready()
        console.log('✅ Farcaster SDK ready() called successfully')
        
        // Step 2: Initialize our context wrapper
        await farcasterSDK.initialize()
        console.log('✅ EcoHunt SDK initialization complete')
      } catch (error) {
        console.error('❌ Error initializing SDK:', error)
      }
    }
    
    initializeSDK()
  }, [])

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithFarcaster />
  </StrictMode>,
)
