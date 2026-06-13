import { useLanguage, LANGUAGES } from '../../context/LanguageContext'
import './Settings.css'

export default function Settings() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="settings">
      <h2 className="settings__title">{t('settingsTitle')}</h2>

      <div className="settings__section">
        <label className="settings__label" htmlFor="language-select">
          {t('languageLabel')}
        </label>
        <p className="settings__hint">{t('languageHint')}</p>

        <select
          id="language-select"
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
    </div>
  )
}
