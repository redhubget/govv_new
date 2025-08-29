// index.js (govv-backend)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// --- security & parsing
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

// --- CORS: allow your Vercel domain + localhost
const allowed = [
  'http://localhost:5173',          // local vite
  'https://govv.vercel.app',        // your Vercel frontend (adjust name)
  'https://*.vercel.app'            // optional wildcard
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);                   // allow curl/postman
    if (allowed.some(a => origin === a || (a.includes('*') && origin.endsWith(a.replace('*.', ''))))) {
      return cb(null, true);
    }
    cb(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: false,
}));

// --- basic rate limit (especially for OTP endpoints)
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// --- health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// --- your routes
import authRouter from './routes/auth.js';
import activitiesRouter from './routes/activities.js';
import warrantyRouter from './routes/warranty.js';
import bikesRouter from './routes/bikes.js';
import telemetryRouter from './routes/telemetry.js';
import serviceCentersRouter from './routes/serviceCenters.js';
import contactRouter from './routes/contact.js';
import userRouter from './routes/user.js';

app.use('/api/auth', authRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/warranty', warrantyRouter);
app.use('/api/bikes', bikesRouter);
app.use('/api/telemetry', telemetryRouter);
app.use('/api/service-centers', serviceCentersRouter);
app.use('/api/contact', contactRouter);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`GoVV API listening on ${PORT}`));

