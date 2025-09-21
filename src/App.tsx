import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './hooks/useWallet'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Camera } from './pages/Camera'
import { Profile } from './pages/Profile'
import { Leaderboard } from './pages/Leaderboard'

function App() {
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
