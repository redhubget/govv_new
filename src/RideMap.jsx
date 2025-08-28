import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
export default function RideMap(){
  const [positions, setPositions] = useState([])
  useEffect(()=>{
    let watchId
    if('geolocation' in navigator){
      watchId = navigator.geolocation.watchPosition((pos)=>{
        const { latitude, longitude } = pos.coords
        setPositions(p=>[...p, [latitude, longitude]].slice(-500))
      }, console.warn, { enableHighAccuracy:true, maximumAge:2000, timeout:8000 })
    }else{
      let i=0; const id=setInterval(()=>{ setPositions(p=>[...p, [12.9716+Math.sin(i/50)*0.001, 77.5946+Math.cos(i/50)*0.001]]); i++ }, 1000); return ()=> clearInterval(id)
    }
    return ()=> navigator.geolocation.clearWatch?.(watchId)
  }, [])
  const center = positions[positions.length-1] || [12.9716, 77.5946]
  return (<div className="map-wrap">
    <MapContainer center={center} zoom={15} style={{height:'100%', width:'100%'}}>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      {positions.length>0 && <Polyline positions={positions} />}
      {positions.length>0 && <Marker position={center}><Popup>You're here</Popup></Marker>}
    </MapContainer>
  </div>)
}