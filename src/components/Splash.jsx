// src/components/Splash.jsx
import React from "react";

export default function Splash() {
  return (
    <div className="splash-wrap">
      <img
        src="/govv-logo.png" // must match public/govv-logo.png
        alt="Go VV Logo"
        className="splash-logo"
      />
    </div>
  );
}

