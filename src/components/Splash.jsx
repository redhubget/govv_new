// src/components/Splash.jsx
import React from "react";

/**
 * Splash screen component
 * Displays the Go VV logo during app load
 */
export default function Splash() {
  return (
    <div className="splash-wrap flex items-center justify-center h-screen bg-white">
      <img
        src="/govv-logo.png" // Correct way to load from public folder
        alt="Go VV Logo"
        className="splash-logo w-48 h-auto animate-pulse"
      />
    </div>
  );
}
