import { useState } from 'react'
import { api } from '../api'
export default function Contact(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [message,setMessage]=useState(''); const [ok,setOk]=useState(false)
  const send=async()=>{ await api.contactSend({name,email,message}); setOk(true) }
  return (<div className="container"><div className="card">
    <h2>Contact</h2>
    <p>Email: go@getgovv.com • Phone: +91-9449700645 • Website: www.getgovv.com</p>
    <input placeholder="Name" value={name} onChange={e=> setName(e.target.value)} style={{width:'100%',padding:10,borderRadius:10,margin:'6px 0'}}/>
    <input placeholder="Email" value={email} onChange={e=> setEmail(e.target.value)} style={{width:'100%',padding:10,borderRadius:10,margin:'6px 0'}}/>
    <textarea placeholder="Message" value={message} onChange={e=> setMessage(e.target.value)} style={{width:'100%',minHeight:80,borderRadius:10,padding:10}}/>
    <button onClick={send} style={{marginTop:8}}>Send</button>
    {ok && <div className="badge" style={{marginTop:8}}>Thanks! We’ll get back to you.</div>}
  </div></div>)
}