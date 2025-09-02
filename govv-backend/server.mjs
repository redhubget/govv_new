// govv-backend/server.mjs
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import multer from "multer";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = process.env.DATA_FILE || "./data/db.json";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "1mb" }));

/** ---------- tiny JSON "DB" ---------- */
const ensureFile = (p) => {
  if (!fs.existsSync(path.dirname(p)))
    fs.mkdirSync(path.dirname(p), { recursive: true });
  if (!fs.existsSync(p)) fs.writeFileSync(p, JSON.stringify({}), "utf8");
};
ensureFile(DATA_FILE);

const defaults = {
  users: [],
  activities: [],
  bikes: [],
  warranty: [],
  serviceCenters: [],
  telemetry: [],
  shop: [],
  bookings: [],
  settings: {}, // key by userId
};
let db = defaults;
try {
  db = { ...defaults, ...JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) };
} catch {}
const saveDB = () => fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));

/** ---------- seed dummy data ---------- */
if (db.bikes.length === 0) {
  db.bikes.push({
    id: "1",
    serial: "GVV-2025-1",
    name: "Go VV Electric Bike",
    locked: true,
    year: 2025,
    model: "GVV-RideX",
    range: "100 km",
    topSpeed: "45 km/h",
    battery: "72% (2.5 kWh)",
  });
}
if (db.activities.length === 0) {
  db.activities.push({
    id: "ride1",
    name: "Morning Ride",
    route: "Koramangala → Indiranagar",
    distance_km: 12.4,
    duration_sec: 2400,
    avg_kmh: 18.2,
    start_time: new Date(Date.now() - 86400000).toISOString(),
  });
}
if (db.shop.length === 0) {
  db.shop = [
    { id: 1, name: "Helmet", price: 1200, img: "/accessories/helmet.png" },
    { id: 2, name: "Phone Holder", price: 800, img: "/accessories/holder.png" },
    { id: 3, name: "LED Light", price: 600, img: "/accessories/light.png" },
    { id: 4, name: "Mount", price: 500, img: "/accessories/mount.png" },
    { id: 5, name: "U-Lock", price: 900, img: "/accessories/ulock.png" },
  ];
}
if (db.serviceCenters.length === 0) {
  db.serviceCenters = [
    { id: 1, name: "Go VV Service - Koramangala", city: "Bangalore", lat: 12.9352, lon: 77.6245 },
    { id: 2, name: "Go VV Service - Indiranagar", city: "Bangalore", lat: 12.9719, lon: 77.6412 },
    { id: 3, name: "Go VV Service - Whitefield", city: "Bangalore", lat: 12.9698, lon: 77.7499 },
    { id: 4, name: "Go VV Service - MG Road", city: "Bangalore", lat: 12.9752, lon: 77.6050 },
  ];
}
saveDB();

/** ---------- health ---------- */
app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

/** ---------- shop ---------- */
app.get("/api/shop", (req, res) => {
  res.json({ data: db.shop });
});

/** ---------- service booking ---------- */
app.post("/api/service/book", (req, res) => {
  const { name, phone, issue, date } = req.body || {};
  if (!name || !phone || !issue || !date) {
    return res.status(400).json({ error: "all fields required" });
  }
  const booking = { id: Date.now().toString(), name, phone, issue, date };
  db.bookings.push(booking);
  saveDB();
  res.json({ success: true, data: booking });
});

/** ---------- activities ---------- */
app.get("/api/activities", (req, res) => {
  res.json({ data: { items: db.activities } });
});

app.get("/api/activities/:id", (req, res) => {
  const a = db.activities.find((a) => a.id === req.params.id);
  if (!a) return res.status(404).json({ error: "not found" });
  res.json({ data: { activity: a } });
});

/** ---------- bikes ---------- */
app.get("/api/bikes/:id", (req, res) => {
  const b = db.bikes.find((x) => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: "not found" });
  res.json({ data: b });
});

/** ---------- warranty ---------- */
app.get("/api/warranty/:serial", (req, res) => {
  const w = db.warranty.find((w) => w.serial === req.params.serial);
  res.json({
    data: w || {
      serial: req.params.serial,
      status: "active",
      purchase_date: "2025-01-01",
      valid_until: "2026-01-01",
      claims: [],
    },
  });
});

app.post("/api/warranty/claim", (req, res) => {
  const { serial, description, user_id = "demo" } = req.body || {};
  if (!serial) return res.status(400).json({ error: "serial required" });
  const claim = { id: Date.now().toString(), serial, description, user_id };
  let w = db.warranty.find((w) => w.serial === serial);
  if (!w) {
    w = { serial, status: "active", purchase_date: "2025-01-01", valid_until: "2026-01-01", claims: [] };
    db.warranty.push(w);
  }
  w.claims.push(claim);
  saveDB();
  res.json({ success: true, data: claim });
});

/** ---------- service centers ---------- */
app.get("/api/service-centers", (req, res) => {
  res.json({ data: { items: db.serviceCenters } });
});

/** ---------- start server ---------- */
app.listen(PORT, () =>
  console.log("GoVV Backend running with dummy APIs on port", PORT)
);
