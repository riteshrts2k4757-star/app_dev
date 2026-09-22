import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MobileFrame from './components/MobileFrame';
import Dashboard from './pages/Dashboard';
import Monitor from './pages/Monitor';
import Logbook from './pages/Logbook';
import Shipments from './pages/Shipments';
import Alerts from './pages/Alerts';
import Gateway from './pages/Gateway';
import Blockchain from './pages/Blockchain';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';

// Mobile preview pages
import MobileHome from './pages/mobile/MobileHome';
import MobileMonitor from './pages/mobile/MobileMonitor';
import MobileLogbook from './pages/mobile/MobileLogbook';
import MobileTrips from './pages/mobile/MobileTrips';
import MobileProfile from './pages/mobile/MobileProfile';

// Detect if running inside Capacitor native runtime (real Android/iOS device)
// On native, the desktop phone-frame preview wrapper is not needed
const isNative = () => {
  try {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  } catch {
    return false;
  }
};

function App() {
  const native = isNative();

  return (
    // HashRouter: required for Capacitor because file:// scheme doesn't support
    // HTML5 history API. All existing routes work identically — only the URL
    // format changes from /path to /#/path.
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Desktop Dashboard */}
        <Route path="/" element={<Layout />}>
          {/* On native Android, redirect root to mobile UI */}
          <Route index element={<Navigate to={native ? '/mobile' : '/dashboard'} replace />} />
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="monitor"    element={<Monitor />} />
          <Route path="logbook"    element={<Logbook />} />
          <Route path="shipments"  element={<Shipments />} />
          <Route path="alerts"     element={<Alerts />} />
          <Route path="gateway"    element={<Gateway />} />
          <Route path="blockchain" element={<Blockchain />} />
          <Route path="settings"   element={<Settings />} />
          <Route path="profile"    element={<Profile />} />
        </Route>

        {/* Mobile routes:
            - On desktop: wrapped in MobileFrame (shows simulated phone shell for preview)
            - On native Android: MobileFrame renders without phone chrome (full screen) */}
        <Route path="/mobile" element={
          <MobileFrame native={native}>
            <MobileHome />
          </MobileFrame>
        } />
        <Route path="/mobile/monitor" element={
          <MobileFrame native={native}>
            <MobileMonitor />
          </MobileFrame>
        } />
        <Route path="/mobile/logbook" element={
          <MobileFrame native={native}>
            <MobileLogbook />
          </MobileFrame>
        } />
        <Route path="/mobile/trips" element={
          <MobileFrame native={native}>
            <MobileTrips />
          </MobileFrame>
        } />
        <Route path="/mobile/profile" element={
          <MobileFrame native={native}>
            <MobileProfile />
          </MobileFrame>
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;
