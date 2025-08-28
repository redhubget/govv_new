import { useAppStore } from '../store'
import { Link } from 'react-router-dom'
export default function Profile(){
  const { user, rides, points, badges, soundEnabled, toggleSound } = useAppStore()
  const setAuth = useAppStore(s=> s.setAuth)
  const logout = ()=> setAuth(null, null)
  return (<div className="container"><div className="grid"><div className="card" style={{gridColumn:'span 12'}}>
    <h2>Profile</h2>
    <p>Name: {user?.name || 'Rider'}</p>
    <p>Rides: {rides}</p>
    <p>Points: {points}</p>
    <p>Badges:</p>
    <ul>{badges.map(b=> <li key={b}>🏅 {b}</li>)}</ul>
    <div style={{marginTop:12, display:'flex', gap:8}}>
      <button onClick={toggleSound}>{soundEnabled? 'Disable':'Enable'} Sounds</button>
      <Link to="/settings"><button className="btn-ghost">Settings</button></Link>
      <button className="btn-ghost" onClick={logout}>Log out</button>
    </div>
  </div></div></div>)
}