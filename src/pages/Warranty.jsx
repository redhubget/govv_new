// src/pages/Warranty.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Warranty() {
  const [serial, setSerial] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!serial.trim()) {
      alert("Enter serial number");
      return;
    }
    // Save to localStorage for persistence
    localStorage.setItem("warranty_serial", serial);
    navigate("/warranty/terms");
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: "0 auto" }}>
        <h2>Warranty Lookup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Serial Number"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            style={{
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 8,
              width: "100%",
              marginBottom: 12,
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              width: "100%",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
