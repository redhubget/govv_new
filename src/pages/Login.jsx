import { useState } from 'react'
import { api } from '../api'
import { useAppStore } from '../store'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const setAuth = useAppStore(s => s.setAuth)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const send = async () => {
    setLoading(true); setError('')
    try {
      await api.sendOTP({ phone })
      setSent(true)
    } catch (e) {
      setError(e.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const verify = async () => {
    setLoading(true); setError('')
    try {
      const { token, user } = await api.verifyOTP({ phone, otp })
      setAuth(user, token)
      navigate('/home', { replace: true })
    } catch (e) {
      setError(e.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: '20px auto' }}>
        <h2>Login / Signup</h2>
        {error && (
          <div className="badge" style={{ background: '#ef4444', color: '#fff', marginBottom: 8 }}>
            {error}
          </div>
        )}
        <input
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 10, marginBottom: 8 }}
        />
        {!sent ? (
          <button onClick={send} disabled={!phone || loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        ) : (
          <>
            <input
              placeholder="Enter OTP (e.g., 123456)"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 10, margin: '8px 0' }}
            />
            <button onClick={verify} disabled={!otp || loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}


