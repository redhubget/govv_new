import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import multer from "multer";

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = process.env.DATA_FILE || "./data/db.json";

app.use(cors());
app.use(express.json());

// Load DB
let db = { users: [], activities: [], bikes: [], warranty: [], serviceCenters: [], telemetry: [] };
function loadDB() {
  try { db = JSON.parse(fs.readFileSync(DATA_FILE)); } catch(e) { console.log("DB load failed, using empty"); }
}
function saveDB() { fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2)); }
loadDB();

// Health check
app.get("/api/health", (req,res)=> res.json({ok:true}));

// User profile
app.get("/api/user/profile", (req,res)=> res.json({data:{profile: db.users[0] || null}}));
app.put("/api/user/profile", (req,res)=> { db.users[0] = {...(db.users[0]||{}), ...req.body}; saveDB(); res.json({data:{profile:db.users[0]}}); });

// User settings
app.get("/api/user/settings", (req,res)=> res.json({data:{settings: db.users[0]?.settings || {theme:'system'}}}));
app.put("/api/user/settings", (req,res)=> { db.users[0].settings = req.body; saveDB(); res.json({data:{settings:db.users[0].settings}}); });

// Activities
app.get("/api/activities", (req,res)=> res.json({data:{items: db.activities}}));
app.get("/api/activities/:id", (req,res)=> {
  const act = db.activities.find(a=>a.id===req.params.id);
  res.json({data:{activity:act}});
});
app.post("/api/activities", (req,res)=> {
  const id = String(Date.now());
  const act = {id, ...req.body, points_earned: Math.round(req.body.distance_km||0)};
  db.activities.push(act); saveDB();
  res.json({success:true, data:{activity:act}});
});

// Tracking start/stop
app.post("/api/tracking/start",(req,res)=> res.json({ride_id:String(Date.now())}));
app.post("/api/tracking/stop",(req,res)=> res.json({ok:true}));

// Warranty
app.get("/api/warranty/:serial", (req,res)=> {
  const w = db.warranty.find(w=>w.serial===req.params.serial);
  res.json({data:w||null});
});
const upload = multer({dest:"uploads/"});
app.post("/api/warranty/claim", upload.single("attachment"), (req,res)=> {
  const {serial, user_id, description} = req.body;
  const claim = {id:String(Date.now()), serial, user_id, description, file:req.file?.filename};
  let w = db.warranty.find(w=>w.serial===serial);
  if(!w){ w={serial, claims:[]}; db.warranty.push(w); }
  w.claims.push(claim); saveDB();
  res.json({success:true, data:{claim}});
});

// Service centers
app.get("/api/service-centers",(req,res)=> res.json({data:db.serviceCenters}));

// Contact
app.post("/api/contact/send",(req,res)=> res.json({success:true, data:req.body}));

// Bikes & telemetry
app.post("/api/bikes/link",(req,res)=> {
  const bike={id:String(Date.now()), serial:req.body.serial, locked:true};
  db.bikes.push(bike); saveDB(); res.json({success:true,data:{bike}});
});
app.get("/api/bikes/:id",(req,res)=> {
  const b=db.bikes.find(b=>b.id===req.params.id);
  res.json({data:b});
});
app.post("/api/bikes/:id/lock",(req,res)=> {
  const b=db.bikes.find(b=>b.id===req.params.id);
  if(!b) return res.status(404).json({error:"not found"});
  if(typeof req.body.locked==="boolean") b.locked=req.body.locked;
  else b.locked=!b.locked;
  saveDB(); res.json({data:b});
});
app.post("/api/telemetry",(req,res)=> {
  const {bike_id,...rest}=req.body;
  db.telemetry.push({bike_id,...rest,ts:Date.now()}); saveDB();
  res.json({ok:true});
});
app.get("/api/telemetry/:bike_id/latest",(req,res)=> {
  const t=[...db.telemetry].reverse().find(t=>t.bike_id===req.params.bike_id);
  res.json({data:t||null});
});

app.listen(PORT, ()=> console.log("Backend running on",PORT));
