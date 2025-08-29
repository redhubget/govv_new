import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import './index.css';

import Home from './pages/Home';
import Track from './pages/Track';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import Shop from './pages/Shop';
import Warranty from './pages/Warranty';
import Contact from './pages/Contact';
import ServiceCenters from './pages/ServiceCenters';
import BikeDetail from './pages/BikeDetail';
import Settings from './pages/Settings';

import Splash from './components/Splash';
import { ThemeProvider, ThemeSwitcher } from './components/ThemeSwitcher';

function useBoot() {
  const [booting, setBooting] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1200); // show splash ~1.2s
    return () => clearTimeout(t);
  }, []);
  return booting;
}

function isAuthed() {
  return !!localStorage.getItem('govv_token');
}

function AuthGate() {
  return isAuthed() ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
}

function Drawer({ open, onClose }) {
  return (
    <div className={'drawer ' + (open ? 'open' : '')}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img src="/govv-logo.png" alt="govv" width="24" height="24" />
          <b>Go VV</b>
        </div>
        <button className="btn-ghost" onClick={onClose}>Close</button>
      </div>
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
      <div style={{ marginTop:16 }}><ThemeSwitcher /></div>
    </div>
  );
}

function BottomTabs(){
  return (
    <div className="bottom-nav">
      <NavLink to="/home" className="bottom-link badge">Home</NavLink>
      <NavLink to="/track" className="bottom-link badge">Track</NavLink>
      <NavLink to="/profile" className="bottom-link badge">Profile</NavLink>
    </div>
  );
}

function RoutesWithAnimation() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }} key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<AuthGate />} />
          <Route path="/login" element={<Login />} />
          {/* Main app */}
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
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const booting = useBoot();

  if (booting) return <Splash />;

  return (
    <ThemeProvider>
      <BrowserRouter>
        <button className="hamburger badge" onClick={() => setOpen(true)}>☰</button>
        <Drawer open={open} onClose={() => setOpen(false)} />
        {isAuthed() && <BottomTabs />}
        <RoutesWithAnimation />
      </BrowserRouter>
    </ThemeProvider>
  );
}



