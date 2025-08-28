import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { initThemeFromStorage } from './lib/theme'  // <-- from earlier step

// Apply theme before first paint
initThemeFromStorage()

const root = createRoot(document.getElementById('root'))
root.render(<App />)

// Register service worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => console.log('Service Worker registered:', reg.scope))
      .catch((err) => console.warn('Service Worker registration failed:', err))
  })
}
