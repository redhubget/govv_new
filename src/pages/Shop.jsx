import { useEffect, useState } from 'react'
export default function Shop(){
  const [items,setItems]=useState([])
  useEffect(()=>{ setItems(JSON.parse(localStorage.getItem('db_products'))||[]) },[])
  return (<div className="container"><h2>Accessories</h2>
    <div className="grid">{items.map(p=> (<div className="card" key={p.id} style={{gridColumn:'span 6'}}>
      <img src={p.img} alt={p.name} style={{width:'100%',borderRadius:12}}/>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <b>{p.name}</b><span>₹{p.price}</span>
      </div>
      <button style={{marginTop:8}}>Add to Cart</button>
    </div>))}</div>
  </div>)
}