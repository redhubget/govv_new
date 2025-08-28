// src/components/ThemeSwitcher.jsx
import { useEffect, useState } from 'react'
import { getTheme, setTheme } from '../lib/theme'

export function ThemeSwitcher() {
  const [theme, setLocal] = useState(getTheme()) // 'light' | 'dark' | 'system'

  useEffect(() => {
    // ensure UI is in sync if changed elsewhere
    const t = getTheme()
    if (t !== theme) setLocal(t)
  }, [])

  const onChange = (e) => {
    const v = e.target.value
    setLocal(v)
    setTheme(v) // persist + apply immediately
  }

  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span className="badge" style={{ width: 'fit-content' }}>Theme</span>
      <select value={theme} onChange={onChange} className="btn-ghost" style={{ padding: 10, borderRadius: 10 }}>
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </label>
  )
}
