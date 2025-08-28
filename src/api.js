const USE_LOCAL_DB = (import.meta.env.VITE_USE_LOCAL_DB || 'true') === 'true'
const LS = {users:'db_users',bikes:'db_bikes',products:'db_products',stations:'db_stations',warranty:'db_warranty',rides:'db_rides',activities:'db_activities',gamification:'db_gamification',telemetry:'db_telemetry',claims:'db_claims',contacts:'db_contacts', serviceCenters:'db_serviceCenters'}
function read(k,f){ try{return JSON.parse(localStorage.getItem(k))??f}catch{return f} } function write(k,v){ localStorage.setItem(k, JSON.stringify(v)) }
if(!localStorage.getItem('seed_v1')){
  write(LS.products,[{id:'p1',name:'Helmet Pro',price:1499,img:'/accessories/helmet.png'},{id:'p2',name:'LED Headlight',price:899,img:'/accessories/light.png'},{id:'p3',name:'Bottle Holder',price:299,img:'/accessories/holder.png'},{id:'p4',name:'Phone Mount',price:499,img:'/accessories/mount.png'},{id:'p5',name:'U-Lock',price:999,img:'/accessories/ulock.png'}])
  write(LS.serviceCenters,[{id:'c1',name:'Go VV Koramangala',city:'Bengaluru',lat:12.9352,lon:77.6245}])
  write(LS.warranty,[{serial:'GVV123456',purchase_date:'2025-01-10',valid_until:'2026-01-10',status:'Active',claims:[]}])
  write(LS.activities,[])
  localStorage.setItem('seed_v1','1')
}
function uid(){ return Math.random().toString(36).slice(2,10) }
export const api = {
  async sendOTP({phone}){ if(USE_LOCAL_DB) return {success:true, otp:'123456', user_id:'u_'+uid()}; throw new Error('Remote API not configured') },
  async verifyOTP({phone,otp}){ if(USE_LOCAL_DB){ const user={id:'u_'+uid(),phone,name:'Rider',bikes:[]}; const users=read(LS.users,[]); users.push(user); write(LS.users,users); return {token:'t_'+uid(), user} } throw new Error('Remote API not configured') },
  async linkBike({serial,user_id}){ const bikes=read(LS.bikes,[]); const id='b_'+uid(); bikes.push({id,serial,locked:true,name:'Go VV Urban Rider'}); write(LS.bikes,bikes); return {id} },
  async getBike(id){ const bikes=read(LS.bikes,[]); return bikes.find(b=>b.id===id)||null },
  async lockBike(id,locked){ const bikes=read(LS.bikes,[]); const b=bikes.find(x=>x.id===id); if(b){b.locked=locked; write(LS.bikes,bikes)} return {ok:true,locked} },
  async postTelemetry(p){ const tel=read(LS.telemetry,[]); tel.push(p); write(LS.telemetry,tel); return {ok:true} },
  async latestTelemetry(bike_id){ const tel=read(LS.telemetry,[]).filter(t=>t.bike_id===bike_id).slice(-1)[0]; return tel||null },
  async trackingStart({user_id}){ const id='r_'+uid(); const rides=read(LS.rides,[]); rides.push({id,user_id,path:[],start_time:Date.now()}); write(LS.rides,rides); return {ride_id:id} },
  async addTrackPoint({ride_id,lat,lon,ts}){ const rides=read(LS.rides,[]); const r=rides.find(x=>x.id===ride_id); if(!r) return; r.path.push({lat,lon,ts}); write(LS.rides,rides) },
  async trackingStop({ride_id,meta}){ const rides=read(LS.rides,[]); const r=rides.find(x=>x.id===ride_id); if(!r) return {ok:false}; r.meta=meta; r.end_time=Date.now(); write(LS.rides,rides); const acts=read(LS.activities,[]); acts.unshift({id:r.id,...meta,path:r.path}); write(LS.activities,acts); return {ok:true,activity_id:r.id} },
  async activities({page=1,pageSize=10}){ const acts=read(LS.activities,[]); const s=(page-1)*pageSize,e=s+pageSize; return {items:acts.slice(s,e), total:acts.length} },
  async activity(id){ const acts=read(LS.activities,[]); return acts.find(a=>a.id===id)||null },
  async warranty(serial){ const w=read(LS.warranty,[]); return w.find(x=>x.serial===serial)||null },
  async warrantyClaim({serial,user_id,description,attachments}){ const w=read(LS.warranty,[]); const item=w.find(x=>x.serial===serial); const claim={id:'cl_'+uid(),user_id,description,attachments:attachments||[],ts:Date.now()}; if(item){ item.claims.push(claim); write(LS.warranty,w) } const claims=read(LS.claims,[]); claims.push(claim); write(LS.claims,claims); return {ok:true,claim} },
  async serviceCenters({city}){ const centers=read(LS.serviceCenters,[]); if(city) return centers.filter(c=>(c.city||'').toLowerCase().includes(city.toLowerCase())); return centers },
  async contactSend(p){ const msgs=read(LS.contacts,[]); msgs.push({...p,id:uid(),ts:Date.now()}); write(LS.contacts,msgs); return {ok:true} },
}