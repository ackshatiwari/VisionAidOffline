import { createContext, useContext, useState } from 'react'

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'ln', label: 'Lingala', native: 'Lingála' },
  { code: 'sw', label: 'Swahili', native: 'Kiswahili' },
]

export const TRANSLATIONS = {
  en: {
    appTagline: 'See the world. Move with confidence.',
    home: 'Home',
    environment: 'Environment',
    audio: 'Audio',
    settings: 'Settings',
    system: 'System',
    priorityFilter: 'Priority Filter',
    about: 'About',
    welcome: 'Welcome to VisionAId Congo',
    welcomeSub: 'Your AI-powered assistant for enhanced awareness and independence.',
    settingsTitle: 'Settings',
    languageLabel: 'Language',
    languageHint: 'Select your preferred language for audio cues and the interface.',
  },
  fr: {
    appTagline: 'Voyez le monde. Avancez avec confiance.',
    home: 'Accueil',
    environment: 'Environnement',
    audio: 'Audio',
    settings: 'Paramètres',
    system: 'Système',
    priorityFilter: 'Filtre de priorité',
    about: 'À propos',
    welcome: 'Bienvenue sur VisionAId Congo',
    welcomeSub: "Votre assistant IA pour une meilleure conscience et indépendance.",
    settingsTitle: 'Paramètres',
    languageLabel: 'Langue',
    languageHint: "Sélectionnez votre langue préférée pour les signaux audio et l'interface.",
  },
  ln: {
    appTagline: 'Tala mokili. Kende na nguya.',
    home: 'Ndako',
    environment: 'Esika',
    audio: 'Mongongo',
    settings: 'Misongi',
    system: 'Système',
    priorityFilter: 'Lisungi ya Ntina',
    about: 'Likambo',
    welcome: 'Boyei malamu na VisionAId Congo',
    welcomeSub: 'Monyokoli na AI mpo na koyeba esika na bino malamu.',
    settingsTitle: 'Misongi',
    languageLabel: 'Lokota',
    languageHint: 'Pona lokota ozali kolinga mpo na mongongo na interface.',
  },
  sw: {
    appTagline: 'Ona ulimwengu. Tembea kwa ujasiri.',
    home: 'Nyumbani',
    environment: 'Mazingira',
    audio: 'Sauti',
    settings: 'Mipangilio',
    system: 'Mfumo',
    priorityFilter: 'Kichujio cha Kipaumbele',
    about: 'Kuhusu',
    welcome: 'Karibu VisionAId Congo',
    welcomeSub: 'Msaidizi wako wa AI kwa ufahamu na uhuru ulioboreshwa.',
    settingsTitle: 'Mipangilio',
    languageLabel: 'Lugha',
    languageHint: 'Chagua lugha unayopendelea kwa ishara za sauti na kiolesura.',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const t = (key) => TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en[key] ?? key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
