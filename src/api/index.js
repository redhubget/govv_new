// src/api/index.js
const API =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/$/, "")) ||
  "https://govv-new.onrender.com/api"; // hard fallback so prod never hits relative /api

// small helper
async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  sendOTP: (data) => request("/auth/send-otp", { method: "POST", body: JSON.stringify(data) }),
  verifyOTP: (data) => request("/auth/verify-otp", { method: "POST", body: JSON.stringify(data) }),

  getActivities: (userId) => request(`/activities/${userId}`),
  getActivity: (id) => request(`/activities/${id}`),

  linkBike: (data) => request("/bikes/link", { method: "POST", body: JSON.stringify(data) }),
  getBike: (id) => request(`/bikes/${id}`),
  toggleLock: (id) => request(`/bikes/${id}/lock`, { method: "POST", body: "{}" }),

  getWarranty: (serial) => request(`/warranty/${serial}`),
  claimWarranty: (data) => request("/warranty/claim", { method: "POST", body: JSON.stringify(data) }),

  sendContact: (data) => request("/contact/send", { method: "POST", body: JSON.stringify(data) }),
};

