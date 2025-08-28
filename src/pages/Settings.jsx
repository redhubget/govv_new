import { useEffect, useState } from 'react'
import { useAppStore } from '../store'
import { ThemeSwitcher } from '../components/ThemeSwitcher'
import { api } from '../lib/api'
import { getTheme, setTheme } from '../lib/theme'

export default function Settings() {
  // Local UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Store: GPS history toggle (privacy)
  const saveGPSHistory = useAppStore((s) => s.saveGPSHistory)
  const setSaveGPSHistory = useAppStore((s) => s.setSaveGPSHistory)

  // Other simple settings we’ll persist on backend too
  const [notifications, setNotifications] = useState(false)
  const [leaderboard, setLeaderboard] = useState(true)
  const [units, setUnits] = useState('km') // or 'mi'
  const [themeSelect, setThemeSelect] = useState(getTheme()) // 'light'|'dark'|'system'

  // Load from backend
  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const r = await api.user.settings()
        const s = r.data?.data?.settings || r.data?.data || r.data || {}

        // backend uses boolean privacy: true means "do not save history"
        // our UI toggle is "Save GPS history" => inverse of privacy
        if (typeof s.privacy === 'boolean') {
          setSaveGPSHistory(!s.privacy)
        }

        if (typeof s.notifications === 'boolean') setNotifications(s.notifications)
        if (typeof s.leaderboard === 'boolean') setLeaderboard(s.leaderboard)
        if (typeof s.units === 'string') setUnits(s.units)
        if (typeof s.theme === 'string') {
          setThemeSelect(s.theme)
          setTheme(s.theme) // apply immediately
        } else {
          // apply from local if backend had none
          setTheme(themeSelect)
        }
      } catch (e) {
        console.warn('Failed to load settings', e)
        // still apply local theme so UI is correct
        setTheme(themeSelect)
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChangeTheme = (v) => {
    setThemeSelect(v)
    setTheme(v) // apply instantly + persist in localStorage
  }

  const onSave = async () => {
    try {
      setSaving(true)
      // Convert UI back to backend shape:
      const payload = {
        theme: themeSelect,           // 'light' | 'dark' | 'system'
        privacy: !saveGPSHistory,     // privacy=true => do NOT save GPS history
        notifications,
        leaderboard,
        units,
      }
      await api.user.updateSettings(payload)
    } catch (e) {
      console.error('Saving settings failed', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ gridColumn: 'span 12' }}>
        <h2>Settings</h2>
      </div>

      <div className="card" style={{ gridColumn: 'span 12', display: 'grid', gap: 14 }}>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <>
            {/* Privacy / GPS history */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={saveGPSHistory}
                onChange={(e) => setSaveGPSHistory(e.target.checked)}
              />
              Save GPS history (uncheck for Privacy)
            </label>

            {/* Theme */}
            <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr', alignItems: 'start' }}>
              <div className="badge" style={{ width: 'fit-content' }}>Theme</div>
              {/* These two controls can coexist; use either or both */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <select
                  value={themeSelect}
                  onChange={(e) => onChangeTheme(e.target.value)}
                  className="btn-ghost"
                  style={{ padding: 10, borderRadius: 10 }}
                >
                  <option value="system">System</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
                {/* Fancy switcher UI you already had */}
                <ThemeSwitcher />
              </div>
            </div>

            {/* Units */}
            <div>
              <div className="badge" style={{ width: 'fit-content', marginBottom: 6 }}>Units</div>
              <select
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="btn-ghost"
                style={{ padding: 10, borderRadius: 10 }}
              >
                <option value="km">Kilometers</option>
                <option value="mi">Miles</option>
              </select>
            </div>

            {/* Social/Notifications */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={leaderboard}
                onChange={(e) => setLeaderboard(e.target.checked)}
              />
              Include my rides in leaderboards
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              Enable notifications
            </label>

            <div>
              <button onClick={onSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save Settings'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
