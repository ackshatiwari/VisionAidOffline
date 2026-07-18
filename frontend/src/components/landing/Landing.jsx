import './Landing.css'

export default function Landing({ onEnter }) {
  return (
    <div className="landing">
      <div className="landing__bg" />

      <div className="landing__content">
        <div className="landing__logo-wrap">
          <svg className="landing__logo" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke="#22c55e" strokeWidth="2" opacity="0.25" />
            <circle cx="40" cy="40" r="24" stroke="#22c55e" strokeWidth="2" opacity="0.5" />
            <circle cx="40" cy="40" r="10" fill="#22c55e" opacity="0.9" />
            <path d="M40 8 Q56 24 56 40 Q56 58 40 72 Q24 58 24 40 Q24 24 40 8Z"
              stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.6" />
          </svg>
        </div>

        <h1 className="landing__title">
          VisionAid <span className="landing__title-accent">Offline</span>
        </h1>
        <p className="landing__tagline">See the world. Move with confidence.</p>
        <p className="landing__desc">
          A real-time awareness system for the visually impaired —<br />
          running entirely on-device, under 100ms, no internet required.
        </p>

        <button className="landing__btn" onClick={onEnter}>
          Launch System
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        <div className="landing__badges">
          <span className="landing__badge">⬡ On-Device AI</span>
          <span className="landing__badge">⚡ &lt;100ms Latency</span>
          <span className="landing__badge">📡 No Internet</span>
          <span className="landing__badge">🌍 DRC</span>
        </div>
      </div>
    </div>
  )
}
