// govv-backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "Go VV Backend is running 🚴‍♂️" });
});

// Example: Dummy activities route
app.get("/api/activities", (req, res) => {
  res.json({
    data: {
      items: [
        { id: 1, name: "Morning Ride", distance_km: 12.3, avg_kmh: 18.5, duration_sec: 2400 },
        { id: 2, name: "Evening Ride", distance_km: 8.7, avg_kmh: 16.2, duration_sec: 1900 }
      ]
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Go VV Backend running on port ${PORT}`);
});
