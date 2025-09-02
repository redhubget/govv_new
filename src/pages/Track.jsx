// src/pages/Track.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { Link, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css"; // ✅ Important

// 🔧 Vite + Leaflet marker icon fix
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2xUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
});

// --- Small layout helpers
const Card = ({ title, children, className = "" }) => (
  <div className={`card ${className}`}>
    {title && (
      <div
        className="text-sm"
        style={{ color: "var(--muted)", marginBottom: 8, letterSpacing: ".02em" }}
      >
        {title}
      </div>
    )}
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", disabled }) => {
  const base = "px-4 py-2 rounded-lg font-medium";
  const styles =
    variant === "primary"
      ? {}
      : variant === "ghost"
      ? { border: "1px solid var(--border)", background: "transparent", color: "var(--text)" }
      : variant === "destructive"
      ? { background: "#ef4444", color: "#fff" }
      : {};
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...styles, opacity: disabled ? 0.6 : 1 }}
      className={base}
    >
      {children}
    </button>
  );
};

// Fit the map to the current path
function FitPath({ path }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !path?.length) return;
    const bounds = L.latLngBounds(path.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, path]);
  return null;
}

// Haversine in km
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function Track() {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [path, setPath] = useState([]); // [{lat,lng,t}]
  const [distance, setDistance] = useState(0); // km
  const [avgSpeed, setAvgSpeed] = useState(0); // km/h
  const [startTime, setStartTime] = useState(null);
  const [base, setBase] = useState({ lat: 12.9716, lng: 77.5946 }); // fallback Bengaluru

  const pausedDurationRef = useRef(0);
  const pauseStartRef = useRef(null);
  const timerRef = useRef(null);
  const pathRef = useRef([]);
  const navigate = useNavigate();

  // center map on user if allowed
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBase({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {}, // ignore error
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    pathRef.current = path;
  }, [path]);

  // create a small random walk tick
  const step = useCallback(() => {
    setPath((prev) => {
      const now = Date.now() / 1000;
      if (prev.length === 0) {
        const first = [{ lat: base.lat, lng: base.lng, t: now }];
        pathRef.current = first;
        return first;
      }
      const last = prev[prev.length - 1];
      const dLat = (Math.random() - 0.5) * 0.00025;
      const dLng = (Math.random() - 0.5) * 0.00025;
      const next = { lat: last.lat + dLat, lng: last.lng + dLng, t: now };
      const d = haversine(last.lat, last.lng, next.lat, next.lng);
      setDistance((cur) => cur + d);
      const updated = [...prev, next];
      pathRef.current = updated;
      return updated;
    });
  }, [base.lat, base.lng]);

  const startTracking = () => {
    if (isTracking) return;
    setIsTracking(true);
    setIsPaused(false);
    pausedDurationRef.current = 0;
    pauseStartRef.current = null;
    setDistance(0);
    setAvgSpeed(0);
    setPath([]);
    setStartTime(Date.now());
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(step, 1000);
  };

  const pauseTracking = () => {
    if (!isTracking || isPaused) return;
    setIsPaused(true);
    pauseStartRef.current = Date.now();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resumeTracking = () => {
    if (!isTracking || !isPaused) return;
    setIsPaused(false);
    if (pauseStartRef.current) {
      pausedDurationRef.current += Date.now() - pauseStartRef.current;
      pauseStartRef.current = null;
    }
    if (!timerRef.current) timerRef.current = setInterval(step, 1000);
  };

  const stopTracking = () => {
    if (!isTracking) return;
    setIsTracking(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const currentPath = pathRef.current || [];
    if (currentPath.length < 2) {
      setPath([]);
      setDistance(0);
      setAvgSpeed(0);
      setStartTime(null);
      return;
    }

    const durationMs =
      Date.now() - (startTime || Date.now()) - pausedDurationRef.current;
    const durationSec = Math.max(0, Math.floor(durationMs / 1000));
    const avgKmh = durationSec > 0 ? distance / (durationSec / 3600) : 0;

    // ✅ Save ride into localStorage
    const history = JSON.parse(localStorage.getItem("ride_history") || "[]");
    const newRide = {
      id: "ride-" + Date.now(),
      name: "Ride " + new Date().toLocaleDateString(),
      route: "Bangalore Demo Route",
      start_time: new Date(startTime).toISOString(),
      distance_km: Number(distance.toFixed(2)),
      duration_sec: durationSec,
      avg_kmh: Number(avgKmh.toFixed(1)),
    };
    history.unshift(newRide);
    localStorage.setItem("ride_history", JSON.stringify(history));

    // reset + navigate
    setStartTime(null);
    pausedDurationRef.current = 0;
    navigate("/activities");
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, []);

  const durationSec = useMemo(() => {
    if (!startTime) return 0;
    return Math.max(
      0,
      Math.floor((Date.now() - startTime - pausedDurationRef.current) / 1000)
    );
  }, [startTime, isPaused, isTracking, path.length]);

  useEffect(() => {
    if (distance > 0 && durationSec > 0) {
      setAvgSpeed(Number((distance / (durationSec / 3600)).toFixed(2)));
    } else {
      setAvgSpeed(0);
    }
  }, [distance, durationSec]);

  const center =
    path.length && !isNaN(path[0].lat) && !isNaN(path[0].lng)
      ? [path[0].lat, path[0].lng]
      : [base.lat, base.lng];

  return (
    <div className="container">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card title={isTracking ? (isPaused ? "Paused" : "Live Ride") : "Ready to Ride"}>
            
            {/* ✅ Map wrapper with fixed height */}
            <div style={{ height: 400, width: "100%", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
              <MapContainer
                center={center}
                zoom={15}
                scrollWheelZoom
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {path.length > 0 && (
                  <>
                    <Polyline positions={path.map((p) => [p.lat, p.lng])} color="#16a34a" weight={4} />
                    <Marker position={[path[0].lat, path[0].lng]} />
                    <Marker position={[path[path.length - 1].lat, path[path.length - 1].lng]} />
                    <FitPath path={path} />
                  </>
                )}
              </MapContainer>
            </div>

            {/* Stats + Controls remain same ... */}
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              <div>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>Distance</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{distance.toFixed(2)} km</div>
              </div>
              <div>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>Avg Speed</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{avgSpeed.toFixed(1)} km/h</div>
              </div>
              <div>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>Duration</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>
                  {Math.floor(durationSec / 60)}m {durationSec % 60}s
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {!isTracking && <Button onClick={startTracking}>Start</Button>}
              {isTracking && !isPaused && <Button onClick={pauseTracking}>Pause</Button>}
              {isTracking && isPaused && <Button onClick={resumeTracking}>Resume</Button>}
              {isTracking && <Button variant="destructive" onClick={stopTracking}>Stop &amp; Save</Button>}
              <Link to="/activities"><Button variant="ghost">History</Button></Link>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card title="Ride Tips">
            <ul style={{ color: "var(--text)", opacity: 0.85, margin: 0, paddingLeft: 18 }}>
              <li>Keep cadence steady for better efficiency</li>
              <li>Watch battery levels on climbs</li>
            </ul>
          </Card>
          <Card title="Achievements">
            <div className="badge">Rookie Rider</div>
            <div className="badge" style={{ marginLeft: 8 }}>5 km</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
