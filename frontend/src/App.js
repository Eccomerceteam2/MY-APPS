import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AsetList from './components/AsetList';
import AsetForm from './components/AsetForm';
import Laporan from './components/Laporan';
import ProfileAkun from './components/ProfileAkun';
import ProfileUsaha from './components/ProfileUsaha';
import ReportIssue from './components/ReportIssue';
import Login from './components/Login';
import Register from './components/Register';
import EmailVerification from './components/EmailVerification';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // login, register, verification
  const [verificationToken, setVerificationToken] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleSwitchToVerification = (token) => {
    setVerificationToken(token);
    setCurrentView('verification');
  };

  const handleRegistrationSuccess = (data) => {
    setVerificationToken(data.user.verification_token);
    setCurrentView('verification');
  };

  const handleVerificationSuccess = () => {
    setCurrentView('login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    switch (currentView) {
      case 'register':
        return (
          <Register
            onSwitchToLogin={handleSwitchToLogin}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        );
      case 'verification':
        return (
          <EmailVerification
            verificationToken={verificationToken}
            onVerificationSuccess={handleVerificationSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        );
      case 'login':
      default:
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={handleSwitchToRegister}
            onSwitchToVerification={handleSwitchToVerification}
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onToggleSidebar={toggleSidebar}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="pt-16 lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<AsetList />} />
            <Route path="/assets/new" element={<AsetForm />} />
            <Route path="/assets/edit/:id" element={<AsetForm />} />
            <Route path="/reports" element={<Laporan />} />
            <Route path="/profile/account" element={<ProfileAkun />} />
            <Route path="/profile/business" element={<ProfileUsaha />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
