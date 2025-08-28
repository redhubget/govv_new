import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store'
import useBattery from '../useBattery'

export default function Home() {
  const { rides, points, badges, streakDays, battery } = useAppStore()
  useBattery()

  const maxRangeKm = Number(import.meta.env.VITE_MAX_RANGE_KM || 60)
  const range = battery.level != null ? Math.round(battery.level * maxRangeKm) : null

  // NEW: local lock state (swap this to come from store when your API is ready)
  const [locked, setLocked] = useState(true)
  const toggleLock = () => setLocked(v => !v)

  return (
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid">
        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div className="badge">🚲 Go VV</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div className="badge">🔥 Streak: {streakDays}d</div>
              <div className="badge">🏅 Badges: {badges.length}</div>
              <div className="badge">⭐ Points: {points}</div>
              <div className="badge">🧭 Rides: {rides}</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 12', textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src="/bike.png" alt="Go VV Bike" style={{ maxWidth: '100%', borderRadius: '12px' }} />
            {/* status chip over image */}
            <div
              className="badge"
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: locked ? 'color-mix(in srgb, #ef4444 18%, transparent)' : 'color-mix(in srgb, #22c55e 18%, transparent)',
                borderColor: locked ? 'color-mix(in srgb, #ef4444 40%, #ffffff0f)' : 'color-mix(in srgb, #22c55e 40%, #ffffff0f)'
              }}
            >
              {locked ? '🔒 Locked' : '🔓 Unlocked'}
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div className="badge">{battery.level != null ? `🔋 ${(battery.level * 100).toFixed(0)}%` : '🔋 —'}</div>
            <div className="badge">{range != null ? `📍 Range: ${range} km` : '📍 Range: —'}</div>

            {/* NEW: toggle button */}
            <button
              onClick={toggleLock}
              style={{
                borderRadius: 999,
                padding: '8px 14px',
                background: locked ? '#ef4444' : '#22c55e',
                color: '#fff',
                border: '1px solid rgba(255,255,255,.08)'
              }}
            >
              {locked ? 'Unlock' : 'Lock'}
            </button>

            {/* optional: go to bike detail */}
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
