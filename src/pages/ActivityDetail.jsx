// src/pages/ActivityDetail.jsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Export helpers
function exportCSV(path) {
  const rows = [["lat", "lon", "ts"], ...path.map((p) => [p.lat, p.lon, p.ts])];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "activity.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function exportGPX(path) {
  const seg = path
    .map(
      (p) =>
        `<trkpt lat="${p.lat}" lon="${p.lon}"><time>${new Date(
          p.ts
        ).toISOString()}</time></trkpt>`
    )
    .join("");
  const gpx = `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="GoVV"><trk><name>Ride</name><trkseg>${seg}</trkseg></trk></gpx>`;
  const blob = new Blob([gpx], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "activity.gpx";
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * ActivityDetail Page
 * - Shows full ride breakdown with dummy data
 * - Map with route polyline and replay controls
 */
export default function ActivityDetail() {
  const { id } = useParams();
  const [act, setAct] = useState(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    // Dummy activity data
    const dummy = {
      id,
      name: "Morning Ride - Demo",
      distance: 12.4,
      duration: 2400, // seconds
      avg_speed: 18.2,
      path: [
        { lat: 12.9352, lon: 77.6245, ts: Date.now() },
        { lat: 12.9370, lon: 77.6290, ts: Date.now() + 600000 },
        { lat: 12.9400, lon: 77.6350, ts: Date.now() + 1200000 },
        { lat: 12.9450, lon: 77.6400, ts: Date.now() + 1800000 },
      ],
    };
    setAct(dummy);
  }, [id]);

  // Replay functionality
  useEffect(() => {
    if (!playing || !act) return;
    timer.current = setInterval(
      () => setIdx((i) => Math.min(i + 1, act.path.length - 1)),
      800
    );
    return () => clearInterval(timer.current);
  }, [playing, act]);

  if (!act)
    return (
      <div className="container">
        <div className="card">
          <div className="skeleton" style={{ height: 300 }} />
        </div>
      </div>
    );

  const center = act.path?.[0]
    ? [act.path[0].lat, act.path[0].lon]
    : [12.9716, 77.5946];

  return (
    <div className="container">
      {/* Ride Info */}
      <div className="card">
        <h2>{act.name || "Ride"}</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div className="badge">
            Distance: {act.distance?.toFixed?.(2)} km
          </div>
          <div className="badge">
            Duration: {Math.round(act.duration / 60)} min
          </div>
          <div className="badge">
            Avg Speed: {act.avg_speed?.toFixed?.(1)} km/h
          </div>
        </div>
      </div>

      {/* Map + Controls */}
      <div className="card">
        <div className="map-wrap" style={{ height: 300 }}>
          <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {act.path && <Polyline positions={act.path.map((p) => [p.lat, p.lon])} />}
            {act.path && (
              <Marker
                position={[
                  act.path[idx]?.lat ?? center[0],
                  act.path[idx]?.lon ?? center[1],
                ]}
              />
            )}
          </MapContainer>
        </div>

        {/* Replay & Export Controls */}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={() => setPlaying((p) => !p)}>
            {playing ? "Pause Replay" : "Play Replay"}
          </button>
          <button className="btn-ghost" onClick={() => setIdx(0)}>
            Reset
          </button>
          <button className="btn-ghost" onClick={() => exportCSV(act.path)}>
            Export CSV
          </button>
          <button className="btn-ghost" onClick={() => exportGPX(act.path)}>
            Export GPX
          </button>
        </div>
      </div>
    </div>
  );
}
