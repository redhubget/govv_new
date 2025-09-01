// src/pages/Home.jsx
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Home() {
  const [bike, setBike] = useState({
    id: "GOVV-123456",
    serial: "GOVV-123456",
    locked: true
  })
  const [lockBusy, setLockBusy] = useState(false)

  const maxRangeKm = Number(import.meta.env.VITE_MAX_RANGE_KM || 60)

  // fake battery %
  const [batteryPct] = useState(75)
  const estRangeKm = useMemo(() => {
    return Math.round((batteryPct / 100) * maxRangeKm)
  }, [batteryPct, maxRangeKm])

  // simulate lock/unlock toggle
  const toggleLock = () => {
    if (lockBusy) return
    setLockBusy(true)
    setTimeout(() => {
      setBike(prev => ({ ...prev, locked: !prev.locked }))
      setLockBusy(false)
    }, 500) // simulate short delay
  }

  return (
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid">

        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div className="badge">🚲 Go VV</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div className="badge">🔧 Bike: {bike.serial}</div>
              <div className="badge">{bike.locked ? '🔒 Locked' : '🔓 Unlocked'}</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 12', textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src="/bike.png" alt="Go VV Bike" style={{ maxWidth: '100%', borderRadius: '12px' }} />
            <div
              className="badge"
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: bike.locked
                  ? 'color-mix(in srgb, #ef4444 18%, transparent)'
                  : 'color-mix(in srgb, #22c55e 18%, transparent)',
                borderColor: bike.locked
                  ? 'color-mix(in srgb, #ef4444 40%, #ffffff0f)'
                  : 'color-mix(in srgb, #22c55e 40%, #ffffff0f)'
              }}
            >
              {bike.locked ? '🔒 Locked' : '🔓 Unlocked'}
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div className="badge">
              {`🔋 ${batteryPct}%`}
            </div>
            <div className="badge">
              {`📍 Range: ${estRangeKm} km`}
            </div>

            <button
              onClick={toggleLock}
              disabled={lockBusy}
              style={{
                borderRadius: 999,
                padding: '8px 14px',
                background: bike.locked ? '#ef4444' : '#22c55e',
                color: '#fff',
                border: '1px solid rgba(255,255,255,.08)',
                opacity: lockBusy ? 0.7 : 1
              }}
            >
              {lockBusy ? 'Please wait…' : (bike.locked ? 'Unlock' : 'Lock')}
            </button>

            <Link to="/bike/demo" className="badge">Bike Detail</Link>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div className="kpi"><div className="label">Quick Actions</div></div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/track"><button>Start Tracking</button></Link>
            <Link to="/profile"><button className="btn-ghost">Profile</button></Link>
          </div>
        </div>

      </motion.div>
    </div>
  )
}


