import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store'
import useBattery from '../useBattery'
export default function Home(){
  const { rides, points, badges, streakDays, battery } = useAppStore()
  useBattery()
  const maxRangeKm = Number(import.meta.env.VITE_MAX_RANGE_KM || 60)
  const range = battery.level!=null ? Math.round(battery.level * maxRangeKm) : null
  return (<div className="container">
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="grid">
      <div className="card" style={{gridColumn:'span 12'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
          <div className="badge">🚲 Go VV</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <div className="badge">🔥 Streak: {streakDays}d</div>
            <div className="badge">🏅 Badges: {badges.length}</div>
            <div className="badge">⭐ Points: {points}</div>
            <div className="badge">🧭 Rides: {rides}</div>
          </div>
        </div>
      </div>
      <div className="card" style={{gridColumn:'span 12', textAlign:'center'}}>
        <img src="/bike.png" alt="Go VV Bike" style={{maxWidth:'100%', borderRadius:'12px'}} />
        <div style={{marginTop:12, display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap'}}>
          <div className="badge">{battery.level!=null? `🔋 ${(battery.level*100).toFixed(0)}%` : '🔋 —'}</div>
          <div className="badge">{range!=null? `📍 Range: ${range} km` : '📍 Range: —'}</div>
          <Link to="/bike/demo" className="badge">🔐 Lock/Unlock</Link>
        </div>
      </div>
      <div className="card" style={{gridColumn:'span 12'}}>
        <div className="kpi"><div className="label">Quick Actions</div></div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <Link to="/track"><button>Start Tracking</button></Link>
          <Link to="/profile"><button className="btn-ghost">Profile</button></Link>
        </div>
      </div>
    </motion.div>
  </div>)
}