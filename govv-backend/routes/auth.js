// routes/auth.js (ESM)
import { Router } from 'express';
const router = Router();

// simple demo store
const otpByPhone = new Map();

router.post('/send-otp', (req, res) => {
  const { phone } = req.body || {};
  if (!phone) return res.status(400).json({ error: 'phone_required' });
  otpByPhone.set(phone, '123456'); // demo code
  res.json({ ok: true, sent: true });
});

router.post(['/verify-otp', '/verify'], (req, res) => {
  const { phone, otp } = req.body || {};
  const expected = otpByPhone.get(phone);
  if (!expected || otp !== expected) return res.status(401).json({ error: 'invalid_otp' });
  otpByPhone.delete(phone);
  const user = { id: phone, phone };
  const token = `tok_${phone}_${Date.now()}`;
  res.json({ ok: true, token, user });
});

export default router;
