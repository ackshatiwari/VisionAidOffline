import { useState } from 'react'
import './PriorityFilter.css'

const OBJECTS = [
  { id: 'person', label: 'Person / Pedestrian',  icon: '🚶', default: 'High'   },
  { id: 'stairs', label: 'Stairs / Steps',        icon: '🪜', default: 'High'   },
  { id: 'chair',  label: 'Chair / Stool',         icon: '🪑', default: 'High'   },
  { id: 'door',   label: 'Door / Doorway',        icon: '🚪', default: 'High'   },
  { id: 'table',  label: 'Table / Desk',          icon: '🪵', default: 'Medium' },
  { id: 'couch',  label: 'Couch / Sofa',          icon: '🛋️', default: 'Medium' },
  { id: 'bed',    label: 'Bed',                   icon: '🛏️', default: 'Medium' },
  { id: 'sink',   label: 'Sink / Toilet',         icon: '🚿', default: 'Low'    },
  { id: 'tv',     label: 'TV / Electronics',      icon: '📺', default: 'Low'    },
  { id: 'other',  label: 'Other Objects',         icon: '📦', default: 'Low'    },
]

const LEVELS = ['High', 'Medium', 'Low', 'Off']

const LEVEL_COLOR = {
  High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e', Off: '#4b5563',
}

const BEHAVIORS = [
  { id: 'top3', label: 'Top 3 Objects',        desc: 'Announce only top 3 priority objects.' },
  { id: 'top5', label: 'Top 5 Objects',        desc: 'Announce top 5 priority objects.' },
  { id: 'all',  label: 'All Important Objects', desc: 'Announce all objects above medium priority.' },
]

export default function PriorityFilter() {
  const [priorities, setPriorities] = useState(
    Object.fromEntries(OBJECTS.map(o => [o.id, o.default]))
  )
  const [behavior, setBehavior] = useState('top3')
  const [threshold, setThreshold] = useState(10)

  return (
    <div className="pf">
      <div className="pf__header">
        <h2 className="pf__title">Priority Filter</h2>
        <p className="pf__subtitle">Focus on what matters most. Choose which objects are important.</p>
      </div>

      <div className="pf__grid">

        {/* Object Priorities */}
        <div className="pf__card">
          <h3 className="pf__card-title">Object Priorities</h3>
          <p className="pf__card-hint">Set priority levels for detected objects.</p>

          <div className="pf__object-list">
            {OBJECTS.map(obj => (
              <div key={obj.id} className="pf__object-row">
                <span className="pf__object-icon">{obj.icon}</span>
                <span className="pf__object-label">{obj.label}</span>
                <select
                  className="pf__select"
                  value={priorities[obj.id]}
                  style={{ color: LEVEL_COLOR[priorities[obj.id]] }}
                  onChange={e => setPriorities(prev => ({ ...prev, [obj.id]: e.target.value }))}
                >
                  {LEVELS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="pf__right">

          {/* Priority Behavior */}
          <div className="pf__card">
            <h3 className="pf__card-title">Priority Behavior</h3>
            <p className="pf__card-hint">How the system should behave.</p>

            <div className="pf__radio-list">
              {BEHAVIORS.map(b => (
                <label
                  key={b.id}
                  className={`pf__radio-row ${behavior === b.id ? 'pf__radio-row--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="behavior"
                    value={b.id}
                    checked={behavior === b.id}
                    onChange={() => setBehavior(b.id)}
                    className="pf__radio-input"
                  />
                  <div>
                    <p className="pf__radio-label">{b.label}</p>
                    <p className="pf__radio-desc">{b.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Alert Threshold */}
          <div className="pf__card">
            <h3 className="pf__card-title">Alert Threshold</h3>
            <p className="pf__card-hint">Only alert when objects are within this distance.</p>

            <div className="pf__slider-wrap">
              <div className="pf__slider-row">
                <span className="pf__slider-bound">1m</span>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={threshold}
                  onChange={e => setThreshold(Number(e.target.value))}
                  className="pf__slider"
                />
                <span className="pf__slider-bound">15m</span>
              </div>
              <p className="pf__slider-value">Alert within <strong style={{ color: '#22c55e' }}>{threshold}m</strong></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
