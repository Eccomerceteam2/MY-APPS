import React from 'react';
import { FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';
import ThemeSelector from './ThemeSelector';

function Navbar({ user, onLogout, onToggleSidebar }) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu button and Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-gray-600 hover:text-primary-600 focus:outline-none"
          >
            <FaBars className="text-xl" />
          </button>
          
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">E-Aset Tracker</h1>
              <p className="text-xs text-gray-500 hidden sm:block">PSAK 16 Compliant</p>
            </div>
          </div>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center space-x-4">
          <ThemeSelector />

          <div className="hidden sm:flex items-center space-x-2 text-gray-700">
            <FaUser className="text-primary-600" />
            <span className="font-medium">{user?.username}</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
