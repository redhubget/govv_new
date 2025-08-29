// index.js (govv-backend, ESM)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit'; // <-- v7+ correct import

// Routers (keep your existing files/exports)
import authRouter from './routes/auth.js';
import activitiesRouter from './routes/activities.js';
import warrantyRouter from './routes/warranty.js';
import bikesRouter from './routes/bikes.js';
import telemetryRouter from './routes/telemetry.js';
import serviceCentersRouter from './routes/serviceCenters.js';
import contactRouter from './routes/contact.js';
import userRouter from './routes/user.js';

const app = express();

// --- security & parsing
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '1mb' }));

// --- CORS: localhost + your Vercel + any preview *.vercel.app
const allowlist = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://govv.vercel.app', // <-- change if your prod domain differs
];
const vercelPreview = /\.vercel\.app$/;

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // curl/postman
      if (allowlist.includes(origin) || vercelPreview.test(origin)) {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS: ' + origin));
    },
    credentials: false,
  })
);

// Optional: handle preflight quickly
app.options('*', cors());

// --- rate limit (protect OTP)
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- health
app.get(['/health', '/api/health'], (req, res) => res.json({ ok: true, ts: Date.now() }));

// --- Mount routers at BOTH /api/... and /...
// This makes the backend tolerant to frontend base URL differences.

app.use(['/api/auth', '/auth'], authRouter);
app.use(['/api/activities', '/activities'], activitiesRouter);
app.use(['/api/warranty', '/warranty'], warrantyRouter);
app.use(['/api/bikes', '/bikes'], bikesRouter);
app.use(['/api/telemetry', '/telemetry'], telemetryRouter);
app.use(['/api/service-centers', '/service-centers'], serviceCentersRouter);
app.use(['/api/contact', '/contact'], contactRouter);
app.use(['/api/user', '/user'], userRouter);

// --- 404 logger (helps diagnose bad paths)
app.use((req, res, next) => {
  console.warn('[404]', req.method, req.originalUrl);
  res.status(404).json({ error: 'not_found', path: req.originalUrl });
});

// --- error handler (CORS, etc.)
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message || err, { path: req.originalUrl });
  res.status(500).json({ error: 'server_error', message: err.message || 'internal' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`GoVV API listening on ${PORT}`));


