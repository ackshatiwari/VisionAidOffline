import { useState } from 'react'
import Sidebar from './components/sidebar/Sidebar'
import Home from './components/home/Home'
import Settings from './components/settings/Settings'
import { LanguageProvider } from './context/LanguageContext'
import './App.css'

const PAGES = {
  home: <Home />,
  settings: <Settings />,
}

function App() {
  const [activePage, setActivePage] = useState('home')

  return (
    <LanguageProvider>
      <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a' }}>
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <main style={{ flex: 1, color: '#fff', padding: '24px', overflow: 'auto' }}>
          {PAGES[activePage] ?? <p style={{ color: '#4b5563' }}>Coming soon</p>}
        </main>
      </div>
    </LanguageProvider>
  )
}

export default App
