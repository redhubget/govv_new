import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import RideMap from '../RideMap'
import { useAppStore } from '../store'
import Confetti from '../Confetti'
import useBattery from '../useBattery'
import { playSfx } from '../sound'
import { api } from '../api'
export default function Track(){
  const addRide = useAppStore(s=>s.addRide)
  const battery = useAppStore(s=>s.battery)
  const soundEnabled = useAppStore(s=>s.soundEnabled)
  const saveGPSHistory = useAppStore(s=> s.saveGPSHistory)
  useBattery()
  const [recording, setRecording] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rideId, setRideId] = useState(null)
  const [km, setKm] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const startTime = useRef(null)
  const timer = useRef(null)
  useEffect(()=>{ if(!recording || paused) return; timer.current=setInterval(()=> setKm(k=> k+0.03), 2000); return ()=> clearInterval(timer.current) }, [recording,paused])
  useEffect(()=>{
    let watchId
    if(!recording || paused) return
    if('geolocation' in navigator){
      watchId = navigator.geolocation.watchPosition((pos)=>{
        const { latitude:lat, longitude:lon } = pos.coords
        if(rideId) api.addTrackPoint({ride_id: rideId, lat, lon, ts: Date.now()})
      }, console.warn, { enableHighAccuracy:true, maximumAge:2000, timeout:8000 })
    }
    return ()=> navigator.geolocation.clearWatch?.(watchId)
  }, [recording, paused, rideId])
  const startRide = async()=>{ const { ride_id } = await api.trackingStart({user_id:'me'}); setRideId(ride_id); setRecording(true); setPaused(false); startTime.current=Date.now(); soundEnabled && playSfx('click') }
  const pauseRide = ()=> setPaused(true)
  const resumeRide = ()=> setPaused(false)
  const stopRide = async()=>{
    const duration = Math.max(1, Math.round((Date.now()-startTime.current)/1000))
    const meta = { name:'Ride', distance: km, duration, avg_speed: (km/(duration/3600)), start_time: startTime.current, notes:'' }
    await api.trackingStop({ride_id: rideId, meta})
    if(saveGPSHistory){ addRide(km) }
    setShowConfetti(true); setRecording(false); setPaused(false)
  }
  return (<div className="container">
    <Confetti show={showConfetti} />
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="grid">
      <div className="card" style={{gridColumn:'span 12'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <div className="badge">GPS Tracking</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <div className="badge">📏 {km.toFixed(2)} km</div>
            <div className="badge">{battery.level!=null? `🔋 ${(battery.level*100).toFixed(0)}%`:'🔋 —'}</div>
            <div className="badge">{battery.charging? '⚡ Charging':'⚡ Not charging'}</div>
          </div>
        </div>
      </div>
      <div className="card" style={{gridColumn:'span 12'}}><RideMap/></div>
      <div className="card" style={{gridColumn:'span 12'}}>
        {!recording ? (<button onClick={startRide}>Start</button>) : (
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            {!paused ? <button onClick={pauseRide}>Pause</button> : <button onClick={resumeRide}>Resume</button>}
            <button onClick={stopRide}>Stop & Save</button>
          </div>
        )}
      </div>
    </motion.div>
  </div>)
}