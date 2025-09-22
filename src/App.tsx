import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { WalletProvider } from './providers/WalletProvider'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Camera } from './pages/Camera'
import { Profile } from './pages/Profile'
import { Leaderboard } from './pages/Leaderboard'
import { farcasterSDK } from './utils/farcaster'
import { sdk } from '@farcaster/miniapp-sdk'

function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing EcoHunt App...')
        
        // Initialize our context wrapper first
        await farcasterSDK.initialize()
        console.log('✅ EcoHunt SDK initialization complete')
        
        // Call ready() as soon as interface is prepared (per Farcaster docs)
        await sdk.actions.ready()
        console.log('✅ Farcaster SDK ready() called - interface prepared')
        
      } catch (error) {
        console.error('❌ Error initializing app:', error)
        // Still try to call ready() even if initialization fails
        try {
          await sdk.actions.ready()
          console.log('✅ Fallback ready() called')
        } catch (readyError) {
          console.error('❌ Fallback ready() failed:', readyError)
        }
      }
    }

    initializeApp()
  }, []) // Empty dependency array ensures this runs only once

  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/camera" element={<Camera />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WalletProvider>
  )
}

export default App
