import { useState } from 'react'
import { api } from '../api'
export default function Warranty(){
  const [serial, setSerial] = useState(''); const [w, setW] = useState(null); const [desc,setDesc]=useState(''); const [msg,setMsg]=useState('')
  const lookup = async()=> setW(await api.warranty(serial))
  const claim = async()=>{ const res=await api.warrantyClaim({serial, description:desc, user_id:'me', attachments:[]}); setMsg('Claim submitted: '+res.claim.id); setW(await api.warranty(serial)) }
  return (<div className="container">
    <div className="card"><h2>Warranty Lookup</h2>
      <input placeholder="Enter Serial" value={serial} onChange={e=> setSerial(e.target.value)} style={{padding:10,borderRadius:10,width:'100%'}}/>
      <button onClick={lookup} style={{marginTop:8}}>Check</button>
    </div>
    {w && (<div className="card">
      <div className="badge">Status: {w.status}</div>
      <p>Purchase: {w.purchase_date} • Valid until: {w.valid_until}</p>
      <h3>Claims</h3><ul>{w.claims.map(c=> <li key={c.id}>#{c.id} — {new Date(c.ts).toLocaleString()}</li>)}</ul>
      <h3>New Claim</h3>
      <textarea placeholder="Describe the issue" value={desc} onChange={e=> setDesc(e.target.value)} style={{width:'100%',minHeight:80,borderRadius:10,padding:10}}/>
      <button onClick={claim} style={{marginTop:8}}>Submit Claim</button>
      {msg && <div className="badge" style={{marginTop:8}}>{msg}</div>}
    </div>)}
  </div>)
}