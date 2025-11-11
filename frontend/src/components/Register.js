import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

function Register({ onSwitchToLogin, onRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    business_name: '',
    business_type: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        business_name: formData.business_name,
        business_type: formData.business_type,
        phone: formData.phone,
        address: formData.address
      });

      setSuccess(true);
      if (onRegistrationSuccess) {
        onRegistrationSuccess(response.data);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <FaEnvelope className="text-green-600 text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Registrasi Berhasil!</h1>
            <p className="text-gray-600 mb-6">
              Silakan periksa email Anda untuk verifikasi akun. Token verifikasi akan ditampilkan untuk testing.
            </p>
            <button
              onClick={onSwitchToLogin}
              className="btn btn-primary w-full"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <FaUser className="text-primary-600 text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">FATracker</h1>
          <p className="text-primary-100">Daftar akun baru</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Registrasi
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <FaUser className="inline mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input"
                  placeholder="Username"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <FaUser className="inline mr-2" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Nama lengkap"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">
                <FaEnvelope className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <FaLock className="inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="Password"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <FaLock className="inline mr-2" />
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  placeholder="Konfirmasi password"
                  required
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Informasi Bisnis (Opsional)</h3>

              <div>
                <label className="label">
                  <FaBuilding className="inline mr-2" />
                  Nama Bisnis
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Nama bisnis"
                />
              </div>

              <div>
                <label className="label">
                  <FaBuilding className="inline mr-2" />
                  Tipe Bisnis
                </label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Pilih tipe bisnis</option>
                  <option value="PT">Perseroan Terbatas (PT)</option>
                  <option value="CV">Commanditaire Vennootschap (CV)</option>
                  <option value="UD">Usaha Dagang (UD)</option>
                  <option value="Perorangan">Perorangan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="label">
                  <FaPhone className="inline mr-2" />
                  Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                  placeholder="Nomor telepon"
                />
              </div>

              <div>
                <label className="label">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Alamat
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input"
                  placeholder="Alamat lengkap"
                  rows="3"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              disabled={loading}
            >
              {loading ? 'Mendaftarkan...' : 'Daftar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Login di sini
              </button>
            </p>
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

export default Register;
