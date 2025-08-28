import { create } from 'zustand'
function todayStr(){ const d=new Date(); return d.toISOString().slice(0,10) }
export const useAppStore = create((set,get)=>({
  user: null, token: null, setAuth: (u,t)=> set({user:u, token:t}),
  saveGPSHistory: true, setSaveGPSHistory: (v)=> set({saveGPSHistory:v}),
  streakDays: 0, lastRideDay: null, badges: [], rides: 0, points: 0, level: 1, totalKm:0,
  addRide: (km=0)=>{
    const rides = get().rides + 1
    const multiplier = 10, bonus = km>=5?50:10, gained = Math.floor(km*multiplier)+bonus
    const points = get().points + gained
    const level = Math.floor(points/1000)+1
    const totalKm = get().totalKm + km
    const setBadges = new Set(get().badges)
    if(rides===1) setBadges.add('First Ride')
    if(rides===10) setBadges.add('10 Rides')
    if(totalKm>=100) setBadges.add('100 km Rider')
    const last = get().lastRideDay, today = todayStr(); let streak = get().streakDays
    if(last){ const diff = Math.round((new Date(today)-new Date(last))/86400000); streak = diff===1?streak+1: (diff>1?1:streak) } else streak = 1
    set({rides, points, level, totalKm, badges:[...setBadges], lastRideDay: today, streakDays: streak})
  },
  battery:{level:null,charging:null}, setBattery:(b)=> set({battery:b}),
  soundEnabled:true, toggleSound:()=> set({soundEnabled: !get().soundEnabled}),
}))