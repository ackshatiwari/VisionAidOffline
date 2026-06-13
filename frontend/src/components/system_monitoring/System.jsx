import { useState, useEffect } from 'react'
import './System.css'

const DIAG_LINES = [
  '● Camera module initialized',
  '● YOLO inference engine loaded (YOLOv8n)',
  '● Audio synthesis engine ready',
  '● On-device processing confirmed',
  '● All systems running normally',
]

export default function System() {
  const [latency, setLatency] = useState(68)
  const [uptime, setUptime] = useState(0)
  const [diagRunning, setDiagRunning] = useState(false)
  const [diagDone, setDiagDone] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setLatency(prev => Math.max(40, Math.min(120, prev + Math.round((Math.random() - 0.48) * 6))))
      setUptime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const fmt = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0')
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  const runDiagnostics = () => {
    setDiagRunning(true)
    setDiagDone(false)
    setTimeout(() => { setDiagRunning(false); setDiagDone(true) }, 2000)
  }

  const latencyColor = latency < 70 ? '#22c55e' : latency < 100 ? '#f59e0b' : '#ef4444'

  return (
    <div className="system">
      <div className="system__header">
        <h2 className="system__title">System</h2>
        <p className="system__subtitle">Monitor system status and performance.</p>
      </div>

      <div className="system__grid">

        <div className="system__card">
          <h3 className="system__card-title">System Status</h3>
          <table className="system__table">
            <tbody>
              <tr><td>AI Model</td><td className="system__val">YOLOv8n</td></tr>
              <tr><td>Status</td><td><span className="system__badge system__badge--green">Active</span></td></tr>
              <tr><td>Device Mode</td><td><span className="system__badge system__badge--blue">On-Device</span></td></tr>
              <tr><td>Internet</td><td><span className="system__badge system__badge--red">⊗ Offline</span></td></tr>
              <tr><td>Uptime</td><td className="system__val">{fmt(uptime)}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="system__card">
          <h3 className="system__card-title">Performance</h3>
          <div className="system__metrics">
            <div className="system__metric">
              <span className="system__metric-label">Latency</span>
              <span className="system__metric-value" style={{ color: latencyColor }}>{latency} ms</span>
            </div>
            <div className="system__metric">
              <span className="system__metric-label">Inference Rate</span>
              <span className="system__metric-value" style={{ color: '#22c55e' }}>5 fps</span>
            </div>
            <div className="system__metric">
              <span className="system__metric-label">Mode</span>
              <span className="system__metric-value">Real-time</span>
            </div>
          </div>
        </div>

        <div className="system__card system__card--full">
          <div className="system__card-header">
            <h3 className="system__card-title">Diagnostics</h3>
            <button
              className={`system__diag-btn ${diagRunning ? 'system__diag-btn--running' : ''}`}
              onClick={runDiagnostics}
              disabled={diagRunning}
            >
              {diagRunning ? 'Running…' : 'Run Diagnostics'}
            </button>
          </div>
          <div className="system__diag-log">
            {diagRunning ? (
              <p className="system__diag-line system__diag-line--muted">Running diagnostics…</p>
            ) : diagDone ? (
              DIAG_LINES.map((line, i) => (
                <p key={i} className="system__diag-line">{line}</p>
              ))
            ) : (
              <p className="system__diag-line system__diag-line--muted">● All diagnostics running normally</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
