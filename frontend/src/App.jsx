import { useState } from 'react'
import Sidebar from './components/sidebar/Sidebar'
import Landing from './components/landing/Landing'
import Home from './components/home/Home'
import Settings from './components/settings/Settings'
import System from './components/system_monitoring/System'
import PriorityFilter from './components/priority_filter/PriorityFilter'
import { LanguageProvider } from './context/LanguageContext'
import './App.css'

const PAGES = {
  home: <Home />,
  settings: <Settings />,
  system: <System />,
  priority_filter: <PriorityFilter />,
}

function App() {
  const [view, setView] = useState('landing')
  const [activePage, setActivePage] = useState('home')

  if (view === 'landing') {
    return (
      <LanguageProvider>
        <Landing onEnter={() => setView('app')} />
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider>
      <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a' }}>
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          onLogoClick={() => setView('landing')}
        />
        <main style={{ flex: 1, color: '#fff', padding: '24px', overflow: 'auto' }}>
          {PAGES[activePage] ?? <p style={{ color: '#4b5563' }}>Coming soon</p>}
        </main>
      </div>
    </LanguageProvider>
  )
}

export default App
