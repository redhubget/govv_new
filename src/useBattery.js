import { useEffect } from 'react'
import { useAppStore } from './store'
export default function useBattery(){
  const setBattery = useAppStore(s=> s.setBattery)
  useEffect(()=>{
    let ref=null
    async function init(){
      try{
        if(navigator.getBattery){
          const b = await navigator.getBattery(); ref=b
          const update=()=> setBattery({level:b.level, charging:b.charging})
          update(); b.addEventListener('levelchange',update); b.addEventListener('chargingchange',update)
        }else{
          let level=0.75; const id=setInterval(()=>{ level=Math.max(0,level-0.005); setBattery({level,charging:false}) },3000); ref={_mock:id}
        }
      }catch(e){ console.warn(e) }
    }
    init(); return ()=>{ if(ref?._mock) clearInterval(ref._mock) }
  }, [setBattery])
}