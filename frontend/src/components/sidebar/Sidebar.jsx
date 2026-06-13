import './Sidebar.css'
import { useLanguage } from '../../context/LanguageContext'

const NAV_ITEMS = [
  { id: 'home', key: 'home', icon: HomeIcon },
  { id: 'priority_filter', key: 'priorityFilter', icon: FilterIcon },
  { id: 'settings', key: 'settings', icon: SettingsIcon },
  { id: 'system', key: 'system', icon: SystemIcon }
]

export default function Sidebar({ activePage, onNavigate, onLogoClick }) {
  const { t } = useLanguage()

  return (
    <aside className="sidebar">
      <div className="sidebar__brand" onClick={onLogoClick} style={{ cursor: onLogoClick ? 'pointer' : 'default' }} title="Back to home">
        <BrandLogo />
        <div>
          <p className="sidebar__brand-name">VisionAId Congo</p>
          <p className="sidebar__brand-tagline">{t('appTagline')}</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ id, key, icon: Icon }) => (
          <button
            key={id}
            className={`sidebar__nav-item ${activePage === id ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => onNavigate?.(id)}
          >
            <Icon className="sidebar__nav-icon" />
            <span className="sidebar__nav-label">{t(key)}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

/* ── Icons (inline SVG, no dependency needed) ── */

function HomeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function EnvironmentIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a4.5 4.5 0 0 1 0 9 4.5 4.5 0 0 1 0-9" />
      <path d="M3.6 15h16.8" />
    </svg>
  )
}

function AudioIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

function HapticsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
      <path d="M14 10V4a2 2 0 0 0-4 0v6" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M6 14v1a6 6 0 0 0 12 0v-3a2 2 0 0 0-4 0" />
    </svg>
  )
}

function FilterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  )
}

function SettingsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function SystemIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

function AboutIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function BrandLogo() {
  return (
    <svg className="sidebar__brand-logo" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="28" stroke="#22c55e" strokeWidth="2" opacity="0.3" />
      <circle cx="30" cy="30" r="18" stroke="#22c55e" strokeWidth="2" opacity="0.5" />
      <circle cx="30" cy="30" r="8" fill="#22c55e" opacity="0.9" />
      <path d="M30 8 Q42 20 42 30 Q42 42 30 52 Q18 42 18 30 Q18 20 30 8Z"
        stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  )
}
