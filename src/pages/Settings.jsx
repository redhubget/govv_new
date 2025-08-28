import { useAppStore } from '../store'
import { ThemeSwitcher } from '../components/ThemeSwitcher'
export default function Settings(){
  const saveGPSHistory = useAppStore(s=> s.saveGPSHistory)
  const setSaveGPSHistory = useAppStore(s=> s.setSaveGPSHistory)
  return (<div className="container">
    <div className="card"><h2>Settings</h2>
      <label style={{display:'flex',alignItems:'center',gap:8}}>
        <input type="checkbox" checked={saveGPSHistory} onChange={e=> setSaveGPSHistory(e.target.checked)} />
        Save GPS history (privacy)
      </label>
    </div>
    <div className="card"><ThemeSwitcher/></div>
  </div>)
}