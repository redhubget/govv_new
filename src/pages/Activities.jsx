import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
export default function Activities(){
  const [items,setItems] = useState([]); const [total,setTotal] = useState(0); const [page,setPage] = useState(1)
  useEffect(()=>{ api.activities({page}).then(({items,total})=>{ setItems(items); setTotal(total) }) }, [page])
  return (<div className="container">
    <div className="card"><h2>History</h2>
      {items.length===0 && <div className="skeleton" style={{height:40}}/>}
      <ul>{items.map(a=> (<li key={a.id} style={{margin:'12px 0'}}>
        <Link to={`/activity/${a.id}`}>🏁 {a.name || 'Ride'} — {a.distance?.toFixed?.(2)} km • {Math.round(a.duration/60)} min</Link>
      </li>))}</ul>
      <div style={{display:'flex',gap:8}}>
        <button className="btn-ghost" onClick={()=> setPage(Math.max(1,page-1))}>Prev</button>
        <div className="badge">Page {page}</div>
        <button className="btn-ghost" onClick={()=> setPage(page+1)}>Next</button>
      </div>
    </div>
  </div>)
}