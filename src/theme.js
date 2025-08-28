import { create } from 'zustand'
const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
export const useTheme = create((set,get)=>({
  theme: localStorage.getItem('theme') || (prefersDark? 'dark':'light'),
  setTheme: (t)=> { localStorage.setItem('theme', t); set({theme:t}); document.documentElement.dataset.theme = t; },
  fontSize: parseInt(localStorage.getItem('fontSize')||'16',10),
  setFontSize: (n)=> { localStorage.setItem('fontSize', String(n)); set({fontSize:n}); document.documentElement.style.fontSize = n+'px' }
}))
document.documentElement.dataset.theme = useTheme.getState().theme
document.documentElement.style.fontSize = useTheme.getState().fontSize + 'px'
