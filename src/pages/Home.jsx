// src/pages/Home.jsx
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Home() {
  const [bike, setBike] = useState(null)
  const [loadingBike, setLoadingBike] = useState(true)
  const [tPoint, setTPoint] = useState(null) // latest telemetry
  const [lockBusy, setLockBusy] = useState(false)

  const maxRangeKm = Number(import.meta.env.VITE_MAX_RANGE_KM || 60)
  const batteryPct = useMemo(() => {
    const lvl = typeof tPoint?.battery === 'number' ? tPoint.battery : null
    // backend battery can be 0..1 (first zip) or 0..100 — normalize:
    if (lvl == null) return null
    return lvl > 1 ? Math.max(0, Math.min(100, lvl)) : Math.round(lvl * 100)
  }, [tPoint])

  const estRangeKm = useMemo(() => {
    if (batteryPct == null) return null
    return Math.round((batteryPct / 100) * maxRangeKm)
  }, [batteryPct, maxRangeKm])

  // Ensure there's a bike id we can use
  useEffect(() => {
    (async () => {
      setLoadingBike(true)
      try {
        let bikeId = localStorage.getItem('govv_bike_id')
        let b = null

        if (bikeId) {
          const r = await api.bikes.detail(bikeId)
          b = r.data?.data || r.data // backend variants
          if (!b?.id) {
            bikeId = null
            localStorage.removeItem('govv_bike_id')
          }
        }

        if (!bikeId) {
          // link a demo bike once (mock serial)
          const res = await api.bikes.link('GOVV-123456')
          b = res.data?.data?.bike || res.data?.bike || res.data
          bikeId = b.id
          localStorage.setItem('govv_bike_id', bikeId)
        }

        setBike(b)

        // pull latest telemetry for battery (won’t fail if none)
        try {
          const tr = await api.telemetry.latest(bikeId)
          setTPoint(tr.data?.data?.point || tr.data?.data || tr.data)
        } catch {
          setTPoint(null)
        }

      } catch (e) {
        console.error('Home: bike init failed', e)
      } finally {
        setLoadingBike(false)
      }
    })()
  }, [])

  const toggleLock = async () => {
    if (!bike?.id || lockBusy) return
    setLockBusy(true)
    try {
      const res = await api.bikes.lock(bike.id) // toggle
      const updated = res.data?.data?.bike || res.data?.data || res.data
      setBike(updated)
    } catch (e) {
      console.error('toggle lock failed', e)
    } finally {
      setLockBusy(false)
    }
  }

  return (
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid">

        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div className="badge">🚲 Go VV</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div className="badge">🔧 Bike: {loadingBike ? '…' : (bike?.serial || bike?.id || '—')}</div>
              <div className="badge">{bike?.locked ? '🔒 Locked' : '🔓 Unlocked'}</div>
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
                background: bike?.locked
                  ? 'color-mix(in srgb, #ef4444 18%, transparent)'
                  : 'color-mix(in srgb, #22c55e 18%, transparent)',
                borderColor: bike?.locked
                  ? 'color-mix(in srgb, #ef4444 40%, #ffffff0f)'
                  : 'color-mix(in srgb, #22c55e 40%, #ffffff0f)'
              }}
            >
              {bike?.locked ? '🔒 Locked' : '🔓 Unlocked'}
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div className="badge">
              {batteryPct != null ? `🔋 ${batteryPct}%` : '🔋 —'}
            </div>
            <div className="badge">
              {estRangeKm != null ? `📍 Range: ${estRangeKm} km` : '📍 Range: —'}
            </div>

            <button
              onClick={toggleLock}
              disabled={!bike || lockBusy}
              style={{
                borderRadius: 999,
                padding: '8px 14px',
                background: bike?.locked ? '#ef4444' : '#22c55e',
                color: '#fff',
                border: '1px solid rgba(255,255,255,.08)',
                opacity: lockBusy ? 0.7 : 1
              }}
            >
              {lockBusy ? 'Please wait…' : (bike?.locked ? 'Unlock' : 'Lock')}
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

