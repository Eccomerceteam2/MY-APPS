import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaTimes } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

function ProfileAkun() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const user = response.data.user;
      setFormData({
        username: user.username,
        email: user.email,
        full_name: user.full_name
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      alert('Gagal memuat data profil');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username harus diisi';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nama lengkap harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.put(`${API_URL}/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local storage with new user data
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('Profil akun berhasil diperbarui');
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.error || 'Gagal memperbarui profil akun';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Edit Profil Akun
        </h1>
        <p className="text-gray-600 mt-1">
          Perbarui informasi akun Anda
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Username */}
          <div>
            <label className="label">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`input ${errors.username ? 'input-error' : ''}`}
              placeholder="Masukkan username"
            />
            {errors.username && (
              <p className="error-message">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="label">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="Masukkan email"
            />
            {errors.email && (
              <p className="error-message">{errors.email}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="label">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`input ${errors.full_name ? 'input-error' : ''}`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.full_name && (
              <p className="error-message">{errors.full_name}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn btn-secondary flex items-center space-x-2"
              disabled={loading}
            >
              <FaTimes />
              <span>Batal</span>
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner w-4 h-4"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProfileAkun;
