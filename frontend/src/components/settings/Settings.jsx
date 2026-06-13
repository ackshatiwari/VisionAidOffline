import { useState } from 'react'
import { useLanguage, LANGUAGES } from '../../context/LanguageContext'
import './Settings.css'

function Row({ label, children }) {
  return (
    <div className="settings__row">
      <span className="settings__row-label">{label}</span>
      {children}
    </div>
  )
}

function Dropdown({ value, onChange, options }) {
  return (
    <select className="settings__select settings__select--inline" value={value} onChange={e => onChange(e.target.value)}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      className={`settings__toggle ${value ? 'settings__toggle--on' : ''}`}
      onClick={() => onChange(!value)}
      aria-pressed={value}
    >
      <span className="settings__toggle-thumb" />
    </button>
  )
}

function Slider({ value, onChange, min = 0, max = 100, unit = '%' }) {
  return (
    <div className="settings__slider-wrap">
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))} className="settings__slider" />
      <span className="settings__slider-val">{value}{unit}</span>
    </div>
  )
}

function StatusBadge({ enabled }) {
  return (
    <span className={`settings__badge ${enabled ? 'settings__badge--on' : 'settings__badge--off'}`}>
      {enabled ? 'Enabled' : 'Disabled'}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {enabled ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
      </svg>
    </span>
  )
}

export default function Settings() {
  const { language, setLanguage, t } = useLanguage()

  const [units, setUnits] = useState('Metric (m)')
  const [distFmt, setDistFmt] = useState('1.0 m')
  const [compass, setCompass] = useState('16 Directions')
  const [startup, setStartup] = useState('Overview')
  const [theme, setTheme] = useState('Dark')
  const [retention, setRetention] = useState('7 Days')

  const [brightness, setBrightness] = useState(70)
  const [uiScale, setUiScale] = useState(100)
  const [highContrast, setHighContrast] = useState(false)

  const [cameraAccess] = useState(true)
  const [micAccess] = useState(true)
  const [dataStorage] = useState('On Device Only')

  return (
    <div className="settings">
      <div className="settings__header">
        <h2 className="settings__title">{t('settingsTitle')}</h2>
        <p className="settings__subtitle">Customize your experience.</p>
      </div>

      <div className="settings__grid">

        {/* Left column */}
        <div className="settings__col">

          {/* General */}
          <div className="settings__card">
            <h3 className="settings__card-title">General</h3>
            <div className="settings__rows">
              <Row label="Units">
                <Dropdown value={units} onChange={setUnits} options={['Metric (m)', 'Imperial (ft)']} />
              </Row>
              <Row label="Distance Format">
                <Dropdown value={distFmt} onChange={setDistFmt} options={['1.0 m', '1 m', '100 cm']} />
              </Row>
              <Row label="Compass Direction">
                <Dropdown value={compass} onChange={setCompass} options={['16 Directions', '8 Directions', '4 Directions']} />
              </Row>
              <Row label="Startup Mode">
                <Dropdown value={startup} onChange={setStartup} options={['Overview', 'Environment', 'Audio Cues']} />
              </Row>
              <Row label="Theme">
                <Dropdown value={theme} onChange={setTheme} options={['Dark', 'Light', 'System']} />
              </Row>
              <Row label="Data Retention">
                <Dropdown value={retention} onChange={setRetention} options={['7 Days', '30 Days', '90 Days', 'Never']} />
              </Row>
            </div>
          </div>

        </div>

        {/* Right column */}
        <div className="settings__col">

          {/* Display */}
          <div className="settings__card">
            <h3 className="settings__card-title">Display</h3>
            <div className="settings__rows">
              <Row label="Radar Brightness">
                <Slider value={brightness} onChange={setBrightness} />
              </Row>
              <Row label="UI Scale">
                <Slider value={uiScale} onChange={setUiScale} />
              </Row>
              <Row label="High Contrast Mode">
                <Toggle value={highContrast} onChange={setHighContrast} />
              </Row>
              {highContrast && (
                <p className="settings__hint">Improve visibility of interface.</p>
              )}
            </div>
          </div>

          {/* Language */}
          <div className="settings__card">
            <h3 className="settings__card-title">{t('languageLabel')}</h3>
            <p className="settings__hint">{t('languageHint')}</p>
            <select
              className="settings__select"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} — {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy */}
          <div className="settings__card">
            <h3 className="settings__card-title">Privacy</h3>
            <div className="settings__rows">
              <Row label="Camera Access"><StatusBadge enabled={cameraAccess} /></Row>
              <Row label="Microphone Access"><StatusBadge enabled={micAccess} /></Row>
              <Row label="Data Storage">
                <span className="settings__badge settings__badge--on">{dataStorage}</span>
              </Row>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
