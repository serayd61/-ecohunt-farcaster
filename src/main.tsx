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
        // Wait for DOM to be fully ready
        await new Promise(resolve => {
          if (document.readyState === 'complete') {
            resolve(void 0)
          } else {
            window.addEventListener('load', () => resolve(void 0))
          }
        })
        
        console.log('🔄 DOM ready, initializing Farcaster SDK...')
        
        // Step 1: Call ready() to remove splash screen (if not already called)
        if (!(window as any).farcasterReady) {
          await sdk.actions.ready()
          console.log('✅ Farcaster SDK ready() called from React')
        } else {
          console.log('✅ Farcaster SDK already ready from early initialization')
        }
        
        // Step 2: Initialize our context wrapper
        await farcasterSDK.initialize()
        console.log('✅ EcoHunt SDK initialization complete')
      } catch (error) {
        console.error('❌ Error initializing SDK:', error)
      }
    }
    
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
