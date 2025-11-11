import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaFileAlt, FaTimes, FaUser, FaBuilding, FaExclamationTriangle } from 'react-icons/fa';

function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { path: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/assets', icon: FaBox, label: 'Daftar Aset' },
    { path: '/reports', icon: FaFileAlt, label: 'Laporan' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:top-16
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Menu items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`
              }
            >
              <item.icon className="text-xl" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}

          {/* Profile menu items */}
          <div className="pt-4 border-t border-gray-200">
            <NavLink
              to="/profile/account"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`
              }
            >
              <FaUser className="text-xl" />
              <span className="font-medium">Edit Profil Akun</span>
            </NavLink>

            <NavLink
              to="/profile/business"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`
              }
            >
              <FaBuilding className="text-xl" />
              <span className="font-medium">Edit Profil Usaha</span>
            </NavLink>

            <NavLink
              to="/report-issue"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`
              }
            >
              <FaExclamationTriangle className="text-xl" />
              <span className="font-medium">Laporkan Masalah</span>
            </NavLink>
          </div>
        </nav>

        {/* Info section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-600">
            <p className="font-semibold mb-1">E-Aset Tracker v1.0</p>
            <p>Standar PSAK 16</p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
