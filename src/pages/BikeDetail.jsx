import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
export default function BikeDetail(){
  const { id } = useParams(); const [bike,setBike]=useState(null); const [locked,setLocked]=useState(true); const [data,setData]=useState([])
  useEffect(()=>{ (async()=>{ const b=await api.getBike(id); setBike(b); setLocked(b?.locked??true); setData(Array.from({length:20},(_,i)=>({ts:i,speed:Math.max(0,Math.sin(i/3)*15+15)}))) })() },[id])
  const toggle = async()=>{ await api.lockBike(id,!locked); setLocked(!locked) }
  if(!bike) return <div className="container"><div className="card"><div className="skeleton" style={{height:200}}/></div></div>
  return (<div className="container">
    <div className="card"><h2>{bike.name}</h2><div className="badge">Serial: {bike.serial}</div><div style={{marginTop:8}}><button onClick={toggle}>{locked?'Unlock':'Lock'}</button></div></div>
    <div className="card"><h3>Recent Telemetry</h3><div style={{height:240}}>
      <ResponsiveContainer width="100%" height="100%"><LineChart data={data}><Line dataKey="speed" dot={false}/><XAxis dataKey="ts"/><YAxis/><Tooltip/></LineChart></ResponsiveContainer>
    </div></div>
  </div>)
}