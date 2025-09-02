// src/pages/BikeDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * BikeDetail Page
 * - Shows bike details (dummy specs for now)
 * - Displays telemetry chart
 * - Handles lock/unlock (dummy state)
 */
export default function BikeDetail() {
  const { id } = useParams();
  const [bike, setBike] = useState(null);
  const [locked, setLocked] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulated API fetch (dummy data for now)
    const fetchBike = () => {
      const dummyBike = {
        id,
        name: "Go VV Electric Bike",
        serial: "GVV-2025-" + id,
        year: 2025,
        model: "GVV-RideX",
        range: "100 km",
        topSpeed: "45 km/h",
        battery: "72% (2.5 kWh)",
      };
      setBike(dummyBike);

      // Generate dummy telemetry data
      const chartData = Array.from({ length: 20 }, (_, i) => ({
        ts: i,
        speed: Math.max(0, Math.sin(i / 3) * 15 + 15),
      }));
      setData(chartData);
    };

    fetchBike();
  }, [id]);

  const toggleLock = () => {
    setLocked((prev) => !prev); // dummy toggle
  };

  if (!bike)
    return (
      <div className="container">
        <div className="card">
          <div className="skeleton" style={{ height: 200 }} />
        </div>
      </div>
    );

  return (
    <div className="container">
      {/* Bike Info */}
      <div className="card">
        <h2>{bike.name}</h2>
        <div className="badge">Serial: {bike.serial}</div>
        <ul style={{ marginTop: 8, lineHeight: "1.6" }}>
          <li>📅 Year: {bike.year}</li>
          <li>🆔 Model: {bike.model}</li>
          <li>🔋 Battery: {bike.battery}</li>
          <li>📍 Range: {bike.range}</li>
          <li>⚡ Top Speed: {bike.topSpeed}</li>
        </ul>
        <div style={{ marginTop: 12 }}>
          <button
            onClick={toggleLock}
            style={{
              borderRadius: 999,
              padding: "8px 14px",
              background: locked ? "#22c55e" : "#ef4444",
              color: "#fff",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            {locked ? "Unlock" : "Lock"}
          </button>
        </div>
      </div>

      {/* Telemetry Chart */}
      <div className="card">
        <h3>Recent Telemetry</h3>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line dataKey="speed" stroke="#3b82f6" dot={false} />
              <XAxis dataKey="ts" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
