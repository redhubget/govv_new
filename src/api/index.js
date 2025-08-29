// src/api/index.js
const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Generic GET
async function get(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Generic POST
async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  // Auth
  sendOTP: (data) => post("/auth/send-otp", data),
  verifyOTP: (data) => post("/auth/verify-otp", data),

  // Bikes
  linkBike: (data) => post("/bikes/link", data),
  getBike: (id) => get(`/bikes/${id}`),
  toggleLock: (id) => post(`/bikes/${id}/lock`, {}),

  // Warranty
  getWarranty: (serial) => get(`/warranty/${serial}`),
  claimWarranty: (data) => post(`/warranty/claim`, data),

  // Contact
  sendContact: (data) => post(`/contact/send`, data),

  // Activities
  getActivities: (userId) => get(`/activities/${userId}`),
  getActivity: (id) => get(`/activities/${id}`),
};
