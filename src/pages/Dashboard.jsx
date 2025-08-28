import { useAppStore } from '../store'
import { Link } from 'react-router-dom'
export default function Dashboard(){
  const user = useAppStore(s=> s.user)
  return (<div className="container"><div className="card">
    <h2>Welcome {user?.name || 'Rider'}</h2>
    <p>Quick links</p>
    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
      <Link to="/track"><button>Start Ride</button></Link>
      <Link to="/activities"><button className="btn-ghost">History</button></Link>
      <Link to="/shop"><button className="btn-ghost">Shop</button></Link>
    </div>
  </div></div>)
}