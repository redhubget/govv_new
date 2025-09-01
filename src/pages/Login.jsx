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
  const [info, setInfo] = useState("")
  const navigate = useNavigate()

  const phoneValid = useMemo(() => /^\+?\d{8,15}$/.test(phone.trim()), [phone])
  const otpValid = useMemo(() => /^\d{4,8}$/.test(otp.trim()), [otp])

  const send = async () => {
    setLoading(true)
    setError("")
    setInfo("")
    try {
      await api.sendOTP({ phone: phone.trim() })
      setSent(true)
      setInfo("OTP sent. Use 123456 for demo login.")
    } catch (e) {
      setError(e?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const verify = async () => {
    setLoading(true)
    setError("")
    setInfo("")
    try {
      // Try backend verify, but always fallback to demo user & token
      let result
      try {
        result = await api.verifyOTP({ phone: phone.trim(), otp: otp.trim() })
      } catch {
        result = { token: "demo_token", user: { name: "Demo User", phone } }
      }

      const token = result?.token || "demo_token"
      const user = result?.user || { name: "Demo User", phone }

      // ✅ Save token so BottomTabs can show
      localStorage.setItem("govv_token", token)
      setAuth(user, token)

      navigate("/home", { replace: true })
    } catch (e) {
      setError(e?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const resetFlow = () => {
    setSent(false)
    setOtp("")
    setError("")
    setInfo("")
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: "20px auto" }}>
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Login / Signup</h2>

        {error && (
          <div
            className="badge"
            style={{ background: "#ef4444", color: "#fff", marginBottom: 10 }}
            role="alert"
          >
            {error}
          </div>
        )}
        {info && (
          <div
            className="badge"
            style={{ background: "#16a34a", color: "#fff", marginBottom: 10 }}
          >
            {info}
          </div>
        )}

        {/* Phone input */}
        <label
          style={{
            display: "block",
            fontSize: 13,
            marginBottom: 6,
            color: "var(--muted)",
          }}
        >
          Phone number
        </label>
        <input
          className="input"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={sent || loading}
          maxLength={18}
          aria-label="Phone number"
        />

        {!sent ? (
          <button
            onClick={send}
            disabled={!phoneValid || loading}
            style={{ marginTop: 12, width: "100%" }}
            aria-disabled={!phoneValid || loading}
          >
            {loading ? "Sending…" : "Send OTP"}
          </button>
        ) : (
          <>
            {/* OTP input */}
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginTop: 16,
                marginBottom: 6,
                color: "var(--muted)",
              }}
            >
              Enter OTP
            </label>
            <input
              className="input"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              autoComplete="one-time-code"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ""))}
              maxLength={8}
              aria-label="One-time password"
              onKeyDown={(e) => {
                if (e.key === "Enter" && otpValid && !loading) verify()
              }}
            />

            <button
              onClick={verify}
              disabled={!otpValid || loading}
              style={{ marginTop: 12, width: "100%" }}
              aria-disabled={!otpValid || loading}
            >
              {loading ? "Verifying…" : "Verify & Continue"}
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <button
                className="btn-ghost"
                type="button"
                onClick={send}
                disabled={loading}
              >
                Resend OTP
              </button>
              <button
                className="btn-ghost"
                type="button"
                onClick={resetFlow}
                disabled={loading}
              >
                Edit phone
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}






