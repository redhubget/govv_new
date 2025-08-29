// src/api/index.js
const RAW = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
// default fallbacks so prod never hits relative /api
const API = RAW || "https://govv-new.onrender.com/api";

async function request(path, options = {}) {
  const url = `${API}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

  if (!res.ok) {
    // Surface the exact URL/status/response so we can see 404 details in console
    const err = new Error(`HTTP ${res.status} ${res.statusText} at ${url}`);
    err.status = res.status;
    err.response = data;
    console.error("[API ERROR]", err);
    throw err;
  }
  return data;
}

export const api = {
  // Auth
  sendOTP: (payload) =>
    request("/auth/send-otp", { method: "POST", body: JSON.stringify(payload) }),
  verifyOTP: (payload) =>
    request("/auth/verify-otp", { method: "POST", body: JSON.stringify(payload) }),

  // sanity ping (useful to confirm base URL)
  health: () => request("/health"),
};

// For quick sanity checks in the browser console
console.log("[API BASE]", API);

