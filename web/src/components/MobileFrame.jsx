import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Activity, FileText, Map, User } from 'lucide-react';
import './MobileFrame.css';

const tabs = [
  { path: '/mobile', icon: Home, label: 'Home' },
  { path: '/mobile/monitor', icon: Activity, label: 'Monitor' },
  { path: '/mobile/logbook', icon: FileText, label: 'Logbook' },
  { path: '/mobile/trips', icon: Map, label: 'Trips' },
  { path: '/mobile/profile', icon: User, label: 'Profile' },
];

const MobileFrame = ({ children }) => {
  return (
    <div className="mobile-preview-bg">
      <div className="mobile-frame">
        {/* Notch */}
        <div className="mobile-notch">
          <div className="mobile-notch-pill" />
        </div>

        {/* Screen Content */}
        <div className="mobile-screen-content">
          {children}
        </div>

        {/* Bottom Tab Bar */}
        <nav className="mobile-tab-bar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.path === '/mobile'}
                className={({ isActive }) => `mobile-tab ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Home Indicator */}
        <div className="mobile-home-indicator">
          <div className="mobile-home-pill" />
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
