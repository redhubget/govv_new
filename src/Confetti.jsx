import { useEffect } from 'react'
export default function Confetti({show=false}){
  useEffect(()=>{
    if(!show) return
    const root=document.createElement('div'); root.style.position='fixed'; root.style.inset='0'; root.style.pointerEvents='none'; root.style.zIndex='9999'; document.body.appendChild(root)
    const pieces=120
    for(let i=0;i<pieces;i++){ const el=document.createElement('div'); el.style.position='absolute'; el.style.width='8px'; el.style.height='14px'; el.style.left=Math.random()*100+'%'; el.style.top='-20px'; el.style.background='hsl('+Math.floor(Math.random()*360)+',90%,60%)'; el.style.transform='rotate('+Math.random()*360+'deg)'; el.style.borderRadius='2px'; el.style.animation=`drop ${3+Math.random()*2}s ease-out ${Math.random()*1}s forwards`; root.appendChild(el) }
    const style=document.createElement('style'); style.textContent='@keyframes drop { to { transform: translateY(120vh) rotate(720deg);} }'; root.appendChild(style)
    const t=setTimeout(()=> document.body.removeChild(root), 6000)
    return ()=>{ clearTimeout(t); root.remove() }
  }, [show])
  return null
}