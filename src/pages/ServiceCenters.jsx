import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { api } from '../api'
export default function ServiceCenters(){
  const [city,setCity]=useState(''); const [items,setItems]=useState([])
  useEffect(()=>{ api.serviceCenters({city}).then(setItems) },[city])
  const center = items[0]? [items[0].lat, items[0].lon] : [12.9716,77.5946]
  return (<div className="container">
    <div className="card"><h2>Service Centers</h2>
      <input placeholder="Search by city" value={city} onChange={e=> setCity(e.target.value)} style={{padding:10,borderRadius:10,width:'100%'}}/>
      <ul>{items.map(c=> <li key={c.id}>{c.name} — {c.city}</li>)}</ul>
    </div>
    <div className="card"><div className="map-wrap">
      <MapContainer center={center} zoom={12} style={{height:'100%',width:'100%'}}>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {items.map(c=> <Marker key={c.id} position={[c.lat,c.lon]}><Popup>{c.name}</Popup></Marker>)}
      </MapContainer>
    </div></div>
  </div>)
}