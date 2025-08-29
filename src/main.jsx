import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Mount React app
const el = document.getElementById('root');
createRoot(el).render(<App />);

// Optional: register a service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}

