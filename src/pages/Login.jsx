import { useState } from 'react';
import { api } from '../api';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const send = async () => {
    setErr('');
    if (!phone) return;
    setLoading(true);
    try {
      await api.sendOTP({ phone });
      setSent(true);
    } catch (e) {
      setErr(e.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setErr('');
    if (!otp) return;
    setLoading(true);
    try {
      const { token, user } = await api.verifyOTP({ phone, otp });
      localStorage.setItem('govv_token', token);
      localStorage.setItem('govv_user', JSON.stringify(user));
      window.location.replace('/home'); // go to app
    } catch (e) {
      setErr(e.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 84 }}>
      <div className="card" style={{ maxWidth: 440, margin: '0 auto', textAlign:'center' }}>
        <img src="/govv-logo.png" alt="govv" style={{ width: 84, margin: '0 auto 10px' }}/>
        <h2 style={{ marginTop: 0, marginBottom: 10, color: 'var(--green)' }}>Welcome to Go VV</h2>
        <p style={{ marginTop: 0, color: 'var(--muted)' }}>OTP based login (use <b>123456</b> on the next step)</p>

        <div style={{ marginTop: 14 }}>
          <input
            placeholder="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ width:'100%', padding:12, borderRadius:12, border:'1px solid var(--border)', outline:'none' }}
          />
        </div>

        {sent && (
          <div style={{ marginTop: 10 }}>
            <input
              placeholder="Enter OTP (123456)"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              style={{ width:'100%', padding:12, borderRadius:12, border:'1px solid var(--border)', outline:'none' }}
            />
          </div>
        )}

        {err && <div style={{ color: '#b91c1c', fontSize: 14, marginTop: 10 }}>{err}</div>}

        <div style={{ display:'flex', gap:8, marginTop: 14, justifyContent:'center' }}>
          {!sent ? (
            <button onClick={send} disabled={!phone || loading}>{loading ? 'Sending…' : 'Send OTP'}</button>
          ) : (
            <>
              <button onClick={verify} disabled={!otp || loading}>{loading ? 'Verifying…' : 'Verify & Continue'}</button>
              <button className="btn-ghost" onClick={()=>{ setSent(false); setOtp(''); }}>Back</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

