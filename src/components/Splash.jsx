// src/components/Splash.jsx
import React from "react";

/**
 * Splash screen component
 * Displays the Go VV logo during app load
 */
// src/components/Splash.jsx
export default function Splash() {
  return (
    <div className="splash-screen">
      {/* ✅ use /govv-logo.png from public/ */}
      <img src="/govv-logo.png" alt="GoVV Logo" width="120" height="120" />
      <h1>Welcome to GoVV</h1>
    </div>
  );
}

