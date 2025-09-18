import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { sdk } from '@farcaster/miniapp-sdk'
import { farcasterSDK } from './utils/farcaster'

function AppWithFarcaster() {

  useEffect(() => {
    let hasInitialized = false
    
    const initializeSDK = async () => {
      // Prevent multiple initializations in StrictMode
      if (hasInitialized) return
      hasInitialized = true
      
      try {
        console.log('🔄 React useEffect initializing Farcaster SDK immediately...')
        
        // Call ready() IMMEDIATELY - don't wait for DOM complete
        if (!(window as any).farcasterReady) {
          await sdk.actions.ready()
          console.log('✅ Farcaster SDK ready() called from React')
          ;(window as any).farcasterReady = true
        } else {
          console.log('✅ Farcaster SDK already ready from early initialization')
        }
        
        // Initialize our context wrapper
        await farcasterSDK.initialize()
        console.log('✅ EcoHunt SDK initialization complete')
      } catch (error) {
        console.error('❌ Error initializing SDK:', error)
      }
    }
    
    // Call immediately - no delay
    initializeSDK()
    
    return () => {
      hasInitialized = false
    }
  }, [])

  // Show app immediately but call ready() when fully loaded
  return <App />
}

// Remove StrictMode to avoid double initialization
createRoot(document.getElementById('root')!).render(
  <AppWithFarcaster />
)
