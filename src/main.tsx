import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { farcasterSDK } from './utils/farcaster'

function AppWithFarcaster() {
  useEffect(() => {
    farcasterSDK.initialize()
  }, [])

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithFarcaster />
  </StrictMode>,
)
