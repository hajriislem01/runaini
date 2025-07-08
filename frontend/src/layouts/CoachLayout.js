import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiHome, FiUsers, FiSettings, FiCalendar, FiUser } from 'react-icons/fi';
import { FaFutbol, FaTrophy } from 'react-icons/fa';

const navItems = [
    { to: '/coach/profile', icon: <FiUser />, label: 'Profile' },
  
  { to: '/coach/dashboard', icon: <FiHome />, label: 'Dashboard' },
  { to: '/coach/players', icon: <FiUsers />, label: 'Players' },
  { to: '/coach/training', icon: <FaFutbol />, label: 'Training' },
  { to: '/coach/agenda', icon: <FiCalendar />, label: 'Agenda' },
  { to: '/coach/matches', icon: <FaTrophy />, label: 'Matches' },
  { to: '/coach/settings', icon: <FiSettings />, label: 'Settings' },
];

const CoachLayout = () => (
  <div className="flex min-h-screen bg-gray-50">
    <aside className="w-64 bg-white border-r">
      <div className="p-6 font-bold text-lg">Soccer Coach<br /><span className="text-blue-600 text-sm">Admin</span></div>
      <nav className="mt-8">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition rounded-lg mb-1 ${isActive ? 'bg-gray-100 font-semibold' : ''}`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <main className="flex-1 p-8">
      <Outlet />
    </main>
  </div>
);

export default CoachLayout;