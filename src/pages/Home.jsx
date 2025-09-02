// src/pages/Home.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * Home Page
 * - Shows bike status (lock, battery, range)
 * - Displays bike image (from /public)
 * - Provides navigation to Bike Detail page
 */
export default function Home() {
  const [locked, setLocked] = useState(false);
  const [lockBusy, setLockBusy] = useState(false);

  // Dummy bike stats
  const batteryPct = 72;
  const estRangeKm = 45;

  const toggleLock = () => {
    if (lockBusy) return;
    setLockBusy(true);
    setTimeout(() => {
      setLocked((prev) => !prev);
      setLockBusy(false);
    }, 600); // simulate delay
  };

  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid"
      >
        {/* Header card */}
        <div className="card" style={{ gridColumn: "span 12" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div className="badge">🚲 Go VV</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div className="badge">
                {locked ? "🔒 Locked" : "🔓 Unlocked"}
              </div>
            </div>
          </div>
        </div>

        {/* Bike image + lock button */}
        <div
          className="card"
          style={{ gridColumn: "span 12", textAlign: "center" }}
        >
          <div style={{ position: "relative" }}>
            <img
              src="/bike.png" // ✅ Correct way to load from public
              alt="Go VV Bike"
              style={{ maxWidth: "100%", borderRadius: "12px" }}
            />

            {/* Status badge */}
            <div
              className="badge"
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: locked
                  ? "rgba(239,68,68,0.2)"
                  : "rgba(34,197,94,0.2)",
                borderColor: locked ? "#ef4444" : "#22c55e",
              }}
            >
              {locked ? "🔒 Locked" : "🔓 Unlocked"}
            </div>
          </div>

          {/* Controls */}
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div className="badge">🔋 {batteryPct}%</div>
            <div className="badge">📍 Range: {estRangeKm} km</div>

            <button
              onClick={toggleLock}
              disabled={lockBusy}
              style={{
                borderRadius: 999,
                padding: "8px 14px",
                background: locked ? "#ef4444" : "#22c55e",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.08)",
                opacity: lockBusy ? 0.7 : 1,
              }}
            >
              {lockBusy ? "Please wait…" : locked ? "Unlock" : "Lock"}
            </button>

            {/* ✅ Updated navigation to Bike Detail page */}
            <Link to="/bike/1" className="badge">
              Bike Detail
            </Link>
          </div>
        </div>

        {/* Quick actions */}
        <div className="card" style={{ gridColumn: "span 12" }}>
          <div className="kpi">
            <div className="label">Quick Actions</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/track">
              <button>Start Tracking</button>
            </Link>
            <Link to="/profile">
              <button className="btn-ghost">Profile</button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
