// src/pages/Login.jsx
import { useState, useMemo } from "react"
import { api } from "../api"
import { useAppStore } from "../store"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const setAuth = useAppStore((s) => s.setAuth)
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const phoneValid = useMemo(() => /^\+?\d{8,15}$/.test(phone.trim()), [phone])
  const otpValid = useMemo(() => /^\d{4,8}$/.test(otp.trim()), [otp])

  const send = async () => {
    setLoading(true)
    setError("")
    try {
      await api.sendOTP({ phone: phone.trim() })
      setSent(true)
    } catch (e) {
      setError(e?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const verify = async () => {
    setLoading(true)
    setError("")
    try {
      const { token, user } = await api.verifyOTP({ phone: phone.trim(), otp: otp.trim() })
      // ✅ Save token so bottom nav shows
      localStorage.setItem("govv_token", token)
      setAuth(user, token)
      navigate("/home", { replace: true })
    } catch (e) {
      setError(e?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: "20px auto" }}>
        <h2>Login / Signup</h2>
        {error && (
          <div className="badge" style={{ background: "#ef4444", color: "#fff", marginBottom: 10 }}>
            {error}
          </div>
        )}
        <input
          className="input"
          type="tel"
          inputMode="tel"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={sent || loading}
        />
        {!sent ? (
          <button onClick={send} disabled={!phoneValid || loading} style={{ marginTop: 12, width: "100%" }}>
            {loading ? "Sending…" : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              className="input"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ""))}
              maxLength={8}
              style={{ marginTop: 12 }}
            />
            <button onClick={verify} disabled={!otpValid || loading} style={{ marginTop: 12, width: "100%" }}>
              {loading ? "Verifying…" : "Verify & Continue"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}




