// src/pages/Login.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/**
 * Dummy Login Page
 * - Simulates login by saving a token to localStorage
 * - After login, redirects to /home
 */
export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const handleSendOtp = () => {
    if (!phone.trim()) {
      alert("Please enter phone number");
      return;
    }
    // Simulate sending OTP
    alert("OTP sent! (use 123456 for demo)");
    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (otp !== "123456") {
      alert("Invalid OTP. Try 123456 for demo.");
      return;
    }
    // ✅ Save dummy token
    localStorage.setItem("govv_token", "demo_token");

    // Redirect to home
    navigate("/home", { replace: true });
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: "0 auto" }}>
        <h2>Login</h2>

        {step === 1 && (
          <>
            <input
              type="tel"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 8,
                width: "100%",
                border: "1px solid #ccc",
                marginTop: 12,
              }}
            />
            <button
              onClick={handleSendOtp}
              style={{
                marginTop: 12,
                padding: "8px 14px",
                borderRadius: 8,
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                width: "100%",
              }}
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP (123456)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 8,
                width: "100%",
                border: "1px solid #ccc",
                marginTop: 12,
              }}
            />
            <button
              onClick={handleVerifyOtp}
              style={{
                marginTop: 12,
                padding: "8px 14px",
                borderRadius: 8,
                background: "#22c55e",
                color: "#fff",
                border: "none",
                width: "100%",
              }}
            >
              Verify & Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
