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

app.use(cors());
app.use(express.json({limit:"1mb"}));

/** ---------- tiny JSON "DB" ---------- */
const ensureFile = (p) => {
  if (!fs.existsSync(path.dirname(p))) fs.mkdirSync(path.dirname(p), { recursive: true });
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
  settings: {} // key by userId
};
let db = defaults;
try { db = { ...defaults, ...JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) }; } catch {}
const saveDB = () => fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));

/** ---------- health ---------- */
app.get("/api/health", (req,res)=> res.json({ ok:true, ts: Date.now() }));

/** ---------- OTP auth (mock) ---------- */
app.post("/api/auth/send-otp", (req,res)=>{
  const { phone } = req.body || {};
  if (!phone) return res.status(400).json({ error: "phone required" });
  return res.json({ success: true, hint: "Use 123456 to verify (mock mode)" });
});

app.post("/api/auth/verify-otp", (req,res)=>{
  const { phone, otp } = req.body || {};
  if (!phone || !otp) return res.status(400).json({ error: "phone & otp required" });
  if (otp !== "123456") return res.status(401).json({ error: "Invalid OTP" });

  // find or create user
  let user = db.users.find(u=>u.phone===phone);
  if (!user) { user = { id: "u_" + phone, phone, name: "GoVV Rider" }; db.users.push(user); saveDB(); }
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user });
});

/** ---------- user settings ---------- */
app.get("/api/user/settings", (req,res)=>{
  const uid = "demo"; // replace with auth if you wire JWT on requests
  const val = db.settings[uid] ?? { privacy:false, leaderboard:true, theme:"system", units:"km", notifications:false };
  res.json({ data: { settings: val } });
});
app.put("/api/user/settings", (req,res)=>{
  const uid = "demo";
  const curr = db.settings[uid] ?? {};
  db.settings[uid] = { ...curr, ...(req.body||{}) };
  saveDB();
  res.json({ data: { settings: db.settings[uid] }});
});

/** ---------- activities ---------- */
const newid = () => String(Date.now()) + Math.random().toString(36).slice(2,6);

app.get("/api/activities", (req,res)=>{
  const limit = Number(req.query.limit || 50);
  const items = [...db.activities].slice(-limit).reverse();
  res.json({ data: { items }});
});

app.get("/api/activities/:id", (req,res)=>{
  const a = db.activities.find(a=>a.id===req.params.id);
  if (!a) return res.status(404).json({ error: "not found" });
  res.json({ data: { activity: a }});
});

app.post("/api/activities", (req,res)=>{
  const body = req.body || {};
  const a = {
    id: newid(),
    name: body.name || "Ride",
    distance_km: Number(body.distance_km || 0),
    duration_sec: Number(body.duration_sec || 0),
    avg_kmh: Number(body.avg_kmh || 0),
    start_time: body.start_time || new Date().toISOString(),
    path: Array.isArray(body.path) ? body.path : [],
    notes: body.notes || "",
    private: !!body.private,
    points_earned: Math.floor(Number(body.distance_km || 0) * 5)
  };
  db.activities.push(a); saveDB();
  res.json({ success: true, data: { activity: a }});
});

/** ---------- tracking ---------- */
app.post("/api/tracking/start", (req,res)=> res.json({ ride_id: newid() }));
app.post("/api/tracking/stop", (req,res)=> res.json({ ok: true }));

/** ---------- bikes & lock ---------- */
app.post("/api/bikes/link", (req,res)=>{
  const { serial, user_id="demo" } = req.body || {};
  if (!serial) return res.status(400).json({ error: "serial required" });
  const b = { id: newid(), serial, user_id, locked: true };
  db.bikes.push(b); saveDB();
  res.json({ data: b });
});
app.get("/api/bikes/:id", (req,res)=>{
  const b = db.bikes.find(x=>x.id===req.params.id);
  if (!b) return res.status(404).json({ error:"not found" });
  res.json({ data: b });
});
app.post("/api/bikes/:id/lock", (req,res)=>{
  const b = db.bikes.find(x=>x.id===req.params.id);
  if (!b) return res.status(404).json({ error:"not found" });
  if (typeof req.body?.locked === "boolean") b.locked = req.body.locked; else b.locked = !b.locked;
  saveDB();
  res.json({ data: b });
});

/** ---------- telemetry ---------- */
app.post("/api/telemetry", (req,res)=>{
  const t = { ...req.body, ts: Date.now() };
  db.telemetry.push(t); saveDB();
  res.json({ ok: true });
});
app.get("/api/telemetry/:bike_id/latest", (req,res)=>{
  const last = [...db.telemetry].reverse().find(t=>t.bike_id===req.params.bike_id);
  res.json({ data: last || null });
});

/** ---------- warranty ---------- */
app.get("/api/warranty/:serial", (req,res)=>{
  const w = db.warranty.find(w=>w.serial===req.params.serial);
  res.json({ data: w || { serial: req.params.serial, status:"unknown", claims: [] }});
});
const upload = multer({ storage: multer.memoryStorage() });
app.post("/api/warranty/claim", upload.any(), (req,res)=>{
  const { serial, user_id="demo", description="" } = req.body || {};
  if (!serial) return res.status(400).json({ error:"serial required" });
  let w = db.warranty.find(w=>w.serial===serial);
  if (!w) { w = { serial, purchase_date: null, valid_until: null, status: "active", claims: [] }; db.warranty.push(w); }
  const claim = { id: newid(), user_id, description, attachments: (req.files||[]).map(f=>({ filename:f.originalname, size:f.size })) };
  w.claims.push(claim); saveDB();
  res.json({ data: { claim, warranty: w }});
});

/** ---------- service centers & contact ---------- */
app.get("/api/service-centers", (req,res)=>{
  const { city, name } = req.query;
  let list = db.serviceCenters;
  if (city) list = list.filter(s=> (s.city||"").toLowerCase().includes(String(city).toLowerCase()));
  if (name) list = list.filter(s=> (s.name||"").toLowerCase().includes(String(name).toLowerCase()));
  res.json({ data: { items: list }});
});
app.post("/api/contact/send", (req,res)=>{
  const { email, phone, message } = req.body || {};
  // stub: you can push into db if needed
  res.json({ ok: true, accepted: true });
});

app.listen(PORT, ()=> console.log("GoVV Backend running on port", PORT));

