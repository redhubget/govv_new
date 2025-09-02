// src/pages/ServiceCenters.jsx
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * ServiceCenters Page
 * - Shows map with Bangalore service centers
 * - Allows booking service via a form (dummy submission)
 */
export default function ServiceCenters() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    issue: "",
    date: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Dummy service centers in Bangalore
  const centers = [
    {
      id: 1,
      name: "Go VV Service - Koramangala",
      lat: 12.9352,
      lon: 77.6245,
    },
    { id: 2, name: "Go VV Service - Indiranagar", lat: 12.9719, lon: 77.6412 },
    { id: 3, name: "Go VV Service - Whitefield", lat: 12.9698, lon: 77.7499 },
    { id: 4, name: "Go VV Service - MG Road", lat: 12.9752, lon: 77.6050 },
    { id: 5, name: "Go VV Service - Electronic City", lat: 12.8390, lon: 77.6770 },
  ];

  const center = [12.9716, 77.5946]; // Bangalore default

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.issue || !form.date) {
      alert("Please fill all fields");
      return;
    }
    setSubmitted(true);
    setForm({ name: "", phone: "", issue: "", date: "" });
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Service Centers</h2>
        <p>Locate our service centers in Bangalore and book a visit.</p>

        {/* Leaflet Map */}
        <div style={{ height: 300, marginTop: 12, borderRadius: 12, overflow: "hidden" }}>
          <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {centers.map((c) => (
              <Marker key={c.id} position={[c.lat, c.lon]}>
                <Popup>{c.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Booking Form */}
      <div className="card" style={{ marginTop: 20 }}>
        <h2>Book a Service</h2>
        {submitted ? (
          <div className="badge" style={{ marginTop: 12 }}>
            ✅ Booking submitted successfully! Our team will contact you.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              style={{ padding: 10, width: "100%", borderRadius: 8, marginBottom: 8 }}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              style={{ padding: 10, width: "100%", borderRadius: 8, marginBottom: 8 }}
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={{ padding: 10, width: "100%", borderRadius: 8, marginBottom: 8 }}
            />
            <textarea
              name="issue"
              placeholder="Describe the issue"
              value={form.issue}
              onChange={handleChange}
              style={{ padding: 10, width: "100%", borderRadius: 8, minHeight: 80 }}
            />
            <button
              type="submit"
              style={{
                marginTop: 12,
                padding: "8px 14px",
                borderRadius: 8,
                background: "#22c55e",
                color: "#fff",
                border: "none",
              }}
            >
              Submit Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
