// src/pages/Activities.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * Activities Page
 * - Shows ride history (dummy data for now)
 * - Each ride links to ActivityDetail page
 */
export default function Activities() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  // Dummy rides
  const dummy = [
    {
      id: "ride1",
      name: "Morning Ride",
      route: "Koramangala → Indiranagar",
      start_time: new Date(Date.now() - 86400000).toISOString(),
      distance_km: 12.4,
      avg_kmh: 18.2,
      duration_sec: 2400,
    },
    {
      id: "ride2",
      name: "Evening Sprint",
      route: "MG Road → Cubbon Park",
      start_time: new Date(Date.now() - 2 * 86400000).toISOString(),
      distance_km: 6.7,
      avg_kmh: 22.5,
      duration_sec: 1100,
    },
    {
      id: "ride3",
      name: "Weekend Long Ride",
      route: "Whitefield → Electronic City",
      start_time: new Date(Date.now() - 5 * 86400000).toISOString(),
      distance_km: 24.9,
      avg_kmh: 17.1,
      duration_sec: 5400,
    },
  ];

  useEffect(() => {
    // For now: only dummy data
    setLoading(true);
    setTimeout(() => {
      setItems(dummy);
      setLoading(false);
    }, 400); // simulate API delay
  }, []);

  return (
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ marginBottom: 16 }}>Ride History</h2>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid" style={{ gap: 12 }}>
            {items.map((a) => (
              <Link
                key={a.id}
                to={`/activity/${a.id}`}
                className="card"
                style={{
                  gridColumn: "span 12",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{a.name || "Ride"}</div>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>
                    {new Date(a.start_time).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                    📍 {a.route}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600 }}>
                    {Number(a.distance_km).toFixed(1)} km
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>
                    {Number(a.avg_kmh).toFixed(1)} km/h •{" "}
                    {Math.round(a.duration_sec / 60)} min
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
