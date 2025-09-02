// src/components/Splash.jsx
import React from "react";

export default function Splash() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff", // or "var(--background)" if using themes
      }}
    >
      {/* ✅ Image loaded from public folder */}
      <img
        src="/govv-logo.png"
        alt="GoVV Logo"
        style={{ width: 120, height: 120, marginBottom: 20 }}
      />
      <h1
        style={{
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "#111",
          letterSpacing: "0.05em",
        }}
      >
        Welcome to GoVV
      </h1>
      <p style={{ color: "#555", marginTop: 8 }}>Your EV journey starts here ⚡</p>
    </div>
  );
}
