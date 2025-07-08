import React from 'react';
import { FaDumbbell, FaChartBar, FaVideo, FaCommentDots, FaHome, FaUser, FaCog } from 'react-icons/fa';
import { NavLink, Outlet } from 'react-router-dom';

const navLinks = [
  { to: '/players', label: 'Home', icon: <FaHome /> },
  { to: '/players/profile', label: 'Profile', icon: <FaUser /> },
  { to: '/players/training', label: 'Training', icon: <FaDumbbell /> },
  { to: '/players/performance', label: 'Performance', icon: <FaChartBar /> },
  { to: '/players/analysis', label: 'Analysis', icon: <FaVideo /> },
  { to: '/players/feedback', label: 'Feedback', icon: <FaCommentDots /> },
  { to: '/players/settings', label: 'Settings', icon: <FaCog /> },
];

const PlayerLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col items-center py-8 px-4">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Player Avatar"
          className="w-16 h-16 rounded-full mb-3 border"
        />
        <div className="font-semibold text-lg">Alex</div>
        <div className="text-gray-400 text-sm mb-8">Team Member</div>
        <nav className="flex flex-col gap-2 w-full">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition hover:bg-gray-100 ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700'}`
              }
              end
            >
              <span className="text-xl">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default PlayerLayout; 