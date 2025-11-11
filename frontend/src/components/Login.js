import React, { useState } from 'react';
import { FaLock, FaUser, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

function Login({ onLogin, onSwitchToRegister, onSwitchToVerification }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      onLogin(response.data.user);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Login gagal';

      if (error.response?.status === 403 && error.response?.data?.verification_token) {
        // Email not verified
        setError(`${errorMessage}. Silakan verifikasi email Anda terlebih dahulu.`);
        // Optionally switch to verification with token
        if (onSwitchToVerification) {
          onSwitchToVerification(error.response.data.verification_token);
        }
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">FATracker</h1>
          <p className="text-primary-100">Akuntansi banget nihh</p>
        </div>

        {/* Login Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Login
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">
                <FaUser className="inline mr-2" />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label className="label">
                <FaLock className="inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Masukkan password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              disabled={loading}
            >
              {loading ? 'Login...' : 'Login'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Daftar di sini
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold mb-2">Untuk testing - daftar akun baru atau gunakan:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>1. Daftar akun baru → Verifikasi email → Login</p>
              <p>2. Atau gunakan akun yang sudah terdaftar</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-primary-100 mt-6 text-sm">
          © 2025 BY DANIL,ARA,ARUM,FEBI,RAFI.
        </p>
      </div>
    </div>
  );
}

export default Login;
