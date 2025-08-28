// src/lib/api.js
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
export { API };

export const api = {
  user: {
    profile: () => axios.get(`${API}/user/profile`),
    updateProfile: (data) => axios.put(`${API}/user/profile`, data),
    settings: () => axios.get(`${API}/user/settings`),
    updateSettings: (data) => axios.put(`${API}/user/settings`, data),
  },

  bikes: {
    /** Link a bike by serial (mock) and return the created bike */
    link: (serial) => axios.post(`${API}/bikes/link`, { serial }),
    /** Get bike by id */
    detail: (id) => axios.get(`${API}/bikes/${id}`),
    /** Toggle or set lock state: pass locked = true/false, or omit to toggle */
    lock: (id, locked) => axios.post(`${API}/bikes/${id}/lock`, locked === undefined ? {} : { locked }),
  },

  telemetry: {
    latest: (bikeId) => axios.get(`${API}/telemetry/${bikeId}/latest`),
    ingest: (payload) => axios.post(`${API}/telemetry`, payload),
  },

  activities: {
    list: (params = {}) => axios.get(`${API}/activities`, { params }),
    detail: (id) => axios.get(`${API}/activities/${id}`),
    add: (data) => axios.post(`${API}/activities`, data),
    start: () => axios.post(`${API}/tracking/start`),
    stop: (data) => axios.post(`${API}/tracking/stop`, data),
  },

  warranty: {
    lookup: (serial) => axios.get(`${API}/warranty/${serial}`),
    claim: (formData) =>
      axios.post(`${API}/warranty/claim`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
  },

  serviceCenters: (query = {}) =>
    axios.get(`${API}/service-centers`, { params: query }),

  contact: (payload) => axios.post(`${API}/contact/send`, payload),

  health: () => axios.get(`${API}/health`),
};
