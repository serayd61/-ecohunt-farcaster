import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Render app immediately
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
