import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiUsers, FiUser, FiCalendar, FiSettings, FiCreditCard, FiMail, FiTarget
} from 'react-icons/fi';

const navItems = [
  { to: '/administration/profile', icon: <FiUser />, label: 'Profile' },
  { to: '/administration/player-management', icon: <FiUsers />, label: 'Groups &  Players' },
  { to: '/administration/coach-management', icon: <FiUser />, label: 'Coaches' },
  { to: '/administration/events-management', icon: <FiTarget />, label: 'Events' },
  { to: '/administration/payment-management', icon: <FiCreditCard />, label: 'Payments' },
  { to: '/administration/agenda-management', icon: <FiCalendar />, label: 'Agenda' },
  { to: '/administration/contact', icon: <FiMail />, label: 'Contact' },
  { to: '/administration/settings', icon: <FiSettings />, label: 'Settings' },
];

const AdministrationSidebar = () => {
  return (
    <>
      {/* Sidebar for tablet and up */}
      <div className="hidden md:flex flex-col w-72 h-screen bg-slate-50 border-r border-[#cedbe8] p-4">
        <h1 className="text-[#0d141c] text-base font-medium mb-4">Administration</h1>
        <div className="flex flex-col gap-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive ? 'bg-[#e7edf4]' : 'hover:bg-gray-100'
                }`
              }
            >
              <span className="text-[#0d141c] text-xl">{item.icon}</span>
              <span className="text-[#0d141c] text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom nav for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-50 border-t border-[#cedbe8] flex justify-around py-2 z-50">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? 'text-blue-600' : 'text-[#0d141c]'
              }`
            }
          >
            <div className="text-xl">{item.icon}</div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default AdministrationSidebar;
