import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Desktop Dashboard */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
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

        {/* Mobile Phone Preview */}
        <Route path="/mobile" element={
          <MobileFrame>
            <MobileHome />
          </MobileFrame>
        } />
        <Route path="/mobile/monitor" element={
          <MobileFrame>
            <MobileMonitor />
          </MobileFrame>
        } />
        <Route path="/mobile/logbook" element={
          <MobileFrame>
            <MobileLogbook />
          </MobileFrame>
        } />
        <Route path="/mobile/trips" element={
          <MobileFrame>
            <MobileTrips />
          </MobileFrame>
        } />
        <Route path="/mobile/profile" element={
          <MobileFrame>
            <MobileProfile />
          </MobileFrame>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
