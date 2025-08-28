import { useTheme } from '../theme'
export function ThemeSwitcher(){
  const {theme,setTheme,fontSize,setFontSize} = useTheme()
  return (<div style={{display:'grid',gap:8}}>
    <div className="badge">Theme</div>
    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
      <button className={theme==='light'?'':'btn-ghost'} onClick={()=> setTheme('light')}>Light</button>
      <button className={theme==='dark'?'':'btn-ghost'} onClick={()=> setTheme('dark')}>Dark</button>
    </div>
    <div className="badge" style={{marginTop:8}}>Font Size</div>
    <input type="range" min="14" max="20" value={fontSize} onChange={e=> setFontSize(parseInt(e.target.value,10))} />
  </div>)
}