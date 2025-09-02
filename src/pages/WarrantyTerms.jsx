// src/pages/WarrantyTerms.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function WarrantyTerms() {
  const navigate = useNavigate();
  const [serial, setSerial] = useState("Unknown");

  useEffect(() => {
    // Load from localStorage (safe even after refresh)
    const saved = localStorage.getItem("warranty_serial");
    if (saved) setSerial(saved);
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Warranty Terms</h2>
        <p>
          Warranty details for bike <b>{serial}</b>.
        </p>
        <ul style={{ paddingLeft: 20, marginTop: 12 }}>
          <li>1 year warranty on battery.</li>
          <li>2 years warranty on motor.</li>
          <li>3 years warranty on frame.</li>
          <li>Warranty void if product is modified.</li>
        </ul>

        <button
          onClick={() => navigate("/warranty")}
          style={{
            marginTop: 16,
            padding: "8px 14px",
            borderRadius: 8,
            background: "#ef4444",
            color: "#fff",
            border: "none",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
