import React, { useState, useEffect } from 'react';
import { FaPalette, FaCheck } from 'react-icons/fa';

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('blue');

  const themes = [
    {
      name: 'blue',
      label: 'Biru',
      colors: {
        primary: 'from-blue-50 to-blue-100',
        gradient: 'linear-gradient(to top, #66ffff 15%, #99ff99 92%)'
      }
    },
    {
      name: 'green',
      label: 'Hijau',
      colors: {
        primary: 'from-green-50 to-green-100',
        gradient: 'linear-gradient(to top, #66ff66 15%, #99ff99 92%)'
      }
    },
    {
      name: 'purple',
      label: 'Ungu',
      colors: {
        primary: 'from-purple-50 to-purple-100',
        gradient: 'linear-gradient(to top, #9966ff 15%, #cc99ff 92%)'
      }
    },
    {
      name: 'pink',
      label: 'Merah Muda',
      colors: {
        primary: 'from-pink-50 to-pink-100',
        gradient: 'linear-gradient(to top, #ff66cc 15%, #ff99dd 92%)'
      }
    },
    {
      name: 'orange',
      label: 'Orange',
      colors: {
        primary: 'from-orange-50 to-orange-100',
        gradient: 'linear-gradient(to top, #ff9966 15%, #ffcc99 92%)'
      }
    },
    {
      name: 'teal',
      label: 'Teal',
      colors: {
        primary: 'from-teal-50 to-teal-100',
        gradient: 'linear-gradient(to top, #66ffff 15%, #99cccc 92%)'
      }
    }
  ];

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeName) => {
    const theme = themes.find(t => t.name === themeName);
    if (theme) {
      // Update CSS custom properties
      document.documentElement.style.setProperty('--theme-primary', theme.colors.primary);
      document.documentElement.style.setProperty('--theme-gradient', theme.colors.gradient);

      // Update body background
      document.body.style.background = theme.colors.gradient;

      // Update localStorage
      localStorage.setItem('app-theme', themeName);
    }
  };

  const handleThemeChange = (themeName) => {
    setSelectedTheme(themeName);
    applyTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Theme selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        title="Pilih Tema"
      >
        <FaPalette className="text-gray-600" />
        <span className="hidden sm:inline text-sm font-medium text-gray-700">Tema</span>
      </button>

      {/* Theme dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Pilih Tema</h3>
              <div className="space-y-2">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => handleThemeChange(theme.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                      selectedTheme === theme.name
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{theme.label}</span>
                    {selectedTheme === theme.name && (
                      <FaCheck className="text-primary-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ThemeSelector;
