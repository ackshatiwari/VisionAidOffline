import { useState } from 'react'
import Webcam from './live_environment/Webcam'
import AudioCues from './live_environment/AudioCues'
import { useLanguage } from '../../context/LanguageContext'
import './Home.css'

export default function Home() {
  const { t } = useLanguage()
  const [detections, setDetections] = useState([])

  return (
    <div className="home">
      <h1>{t('welcome')}</h1>
      <p>{t('welcomeSub')}</p>
      <div className="home__container">
        <Webcam onDetections={setDetections} />
        <AudioCues detections={detections} />
      </div>
    </div>
  )
}
