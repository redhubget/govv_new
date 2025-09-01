// App.jsx
import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css' // ✅ Leaflet default styles

// Global styles
import './index.css'

// Pages
import Home from './pages/Home'
import Track from './pages/Track'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Activities from './pages/Activities'
import ActivityDetail from './pages/ActivityDetail'
import Shop from './pages/Shop'
import Warranty from './pages/Warranty'
import Contact from './pages/Contact'
import ServiceCenters from './pages/ServiceCenters'
import BikeDetail from './pages/BikeDetail'
import Settings from './pages/Settings'

// Components
import Splash from './components/Splash'
import { ThemeProvider, ThemeSwitcher } from './components/ThemeSwitcher'

/* ✅ Boot splash hook */
function useBoot() {
  const [booting, setBooting] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1200) // splash lasts ~1.2s
    return () => clearTimeout(t)
  }, [])
  return booting
}

/* ✅ Simple auth check using token in localStorage */
function isAuthed() {
  return !!localStorage.getItem('govv_token')
}

/* ✅ Redirect root to either login or home */
function AuthGate() {
  return isAuthed() ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
}

/* ✅ Drawer (opens from right, includes links + theme switcher) */
function Drawer({ open, onClose }) {
  return (
    <div className={'drawer ' + (open ? 'open' : '')}>
      {/* Drawer header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img src="/govv-logo.png" alt="govv" width="24" height="24" />
          <b>Go VV</b>
        </div>
        <button className="btn-ghost" onClick={onClose}>Close</button>
      </div>

      {/* Drawer links */}
      <nav style={{ display:'grid', gap:8 }} onClick={onClose}>
        <NavLink to="/dashboard" className="badge">Dashboard</NavLink>
        <NavLink to="/activities" className="badge">History / Activities</NavLink>
        <NavLink to="/shop" className="badge">Shop</NavLink>
        <NavLink to="/warranty" className="badge">Warranty</NavLink>
        <NavLink to="/service-centers" className="badge">Service Centers</NavLink>
        <NavLink to="/contact" className="badge">Contact</NavLink>
        <NavLink to="/settings" className="badge">Settings</NavLink>
        {!isAuthed() ? <NavLink to="/login" className="badge">Login / Signup</NavLink> : null}
      </nav>

      {/* Theme switcher */}
      <div style={{ marginTop:16 }}>
        <ThemeSwitcher />
      </div>
    </div>
  )
}

/* ✅ Bottom navigation with Hamburger */
function BottomTabs({ onHamburger }) {
  return (
    <div className="bottom-nav">
      <NavLink to="/home" className="bottom-link badge">🏠 Home</NavLink>
      <NavLink to="/track" className="bottom-link badge">📍 Track</NavLink>
      <NavLink to="/profile" className="bottom-link badge">👤 Profile</NavLink>
      <button className="bottom-link badge" onClick={onHamburger}>☰</button>
    </div>
  )
}

/* ✅ Animated route transitions */
function RoutesWithAnimation() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity:0, x:10 }}
        animate={{ opacity:1, x:0 }}
        exit={{ opacity:0, x:-10 }}
        key={location.pathname}
      >
        <Routes location={location}>
          <Route path="/" element={<AuthGate />} />
          <Route path="/login" element={<Login />} />
          {/* Main app routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/track" element={<Track />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activity/:id" element={<ActivityDetail />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/service-centers" element={<ServiceCenters />} />
          <Route path="/bike/:id" element={<BikeDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

/* ✅ Main App */
export default function App() {
  const [open, setOpen] = useState(false)
  const booting = useBoot()

  // Show splash screen while booting
  if (booting) return <Splash />

  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Drawer */}
        <Drawer open={open} onClose={() => setOpen(false)} />

        {/* Routes */}
        <RoutesWithAnimation />

        {/* Bottom navigation (only when logged in) */}
        {isAuthed() && <BottomTabs onHamburger={() => setOpen(true)} />}
      </BrowserRouter>
    </ThemeProvider>
  )
}




