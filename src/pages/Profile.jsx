// src/pages/Profile.jsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../lib/api'

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('')

  const [settings, setSettings] = useState({
    theme: 'system',
    privacy: false,
    leaderboard: true,
    units: 'km',
    notifications: false,
  })

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const [pr, sr] = await Promise.all([api.user.profile(), api.user.settings()])
        const p = pr.data?.data?.profile || pr.data?.data || pr.data || {}
        const s = sr.data?.data?.settings || sr.data?.data || sr.data || {}

        setName(p.name || '')
        setEmail(p.email || '')
        setAvatar(p.avatar_b64 || '')
        setSettings({ ...settings, ...s })
      } catch (e) {
        console.error('Profile load failed', e)
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result)
    reader.readAsDataURL(file)
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      await api.user.updateProfile({ name, email, avatar_b64: avatar })
      await api.user.updateSettings(settings)
    } catch (e) {
      console.error('Profile save failed', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid" style={{ gap: 16 }}>
        <div className="card" style={{ gridColumn: 'span 12' }}>
          <h2>Profile</h2>
        </div>

        {loading ? (
          <div className="card" style={{ gridColumn: 'span 12' }}>Loading…</div>
        ) : (
          <>
            <div className="card" style={{ gridColumn: 'span 12' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div className="badge">Avatar</div>
                <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,.1)' }}>
                  {avatar ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'grid', placeItems: 'center', height: '100%', opacity: .7 }}>No image</div>}
                </div>
                <label className="badge" style={{ cursor: 'pointer' }}>
                  Upload <input type="file" accept="image/*" onChange={onAvatarChange} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <div className="card" style={{ gridColumn: 'span 12' }}>
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <div>
                  <div className="badge" style={{ marginBottom: 6 }}>Name</div>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="btn-ghost" style={{ width: '100%', padding: 10, borderRadius: 10 }} />
                </div>
                <div>
                  <div className="badge" style={{ marginBottom: 6 }}>Email</div>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="btn-ghost" style={{ width: '100%', padding: 10, borderRadius: 10 }} />
                </div>
              </div>
            </div>

            <div className="card" style={{ gridColumn: 'span 12' }}>
              <div className="badge" style={{ marginBottom: 8 }}>Settings</div>
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <div>
                  <div style={{ fontSize: 13, opacity: .8, marginBottom: 4 }}>Theme</div>
                  <select value={settings.theme} onChange={(e) => setSettings({ ...settings, theme: e.target.value })} className="btn-ghost" style={{ width: '100%', padding: 10, borderRadius: 10 }}>
                    <option value="system">System</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="govv">GoVV</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={!!settings.privacy} onChange={(e) => setSettings({ ...settings, privacy: e.target.checked })} />
                    Don’t save GPS history (Privacy)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={!!settings.notifications} onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })} />
                    Notifications
                  </label>
                </div>
              </div>
            </div>

            <div className="card" style={{ gridColumn: 'span 12' }}>
              <button onClick={saveProfile} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
