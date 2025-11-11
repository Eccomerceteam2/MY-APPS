import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaTimes } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

function ProfileUsaha() {
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: 'personal',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const businessTypes = [
    { value: 'personal', label: 'Personal' },
    { value: 'business', label: 'Bisnis' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

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
        business_name: user.business_name || '',
        business_type: user.business_type || 'personal',
        phone: user.phone || '',
        address: user.address || ''
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

    if (!formData.business_name.trim()) {
      newErrors.business_name = 'Nama usaha harus diisi';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
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

      alert('Profil usaha berhasil diperbarui');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Gagal memperbarui profil usaha: ' + (err.response?.data?.message || err.message));
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
          Edit Profil Usaha
        </h1>
        <p className="text-gray-600 mt-1">
          Perbarui informasi usaha Anda
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Business Name */}
          <div>
            <label className="label">
              Nama Usaha <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className={`input ${errors.business_name ? 'input-error' : ''}`}
              placeholder="Masukkan nama usaha"
            />
            {errors.business_name && (
              <p className="error-message">{errors.business_name}</p>
            )}
          </div>

          {/* Business Type */}
          <div>
            <label className="label">
              Tipe Usaha <span className="text-red-500">*</span>
            </label>
            <select
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
              className="input"
            >
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="label">
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input ${errors.phone ? 'input-error' : ''}`}
              placeholder="Masukkan nomor telepon"
            />
            {errors.phone && (
              <p className="error-message">{errors.phone}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Format: +62xxxxxxxxxx atau 08xxxxxxxxxx
            </p>
          </div>

          {/* Address */}
          <div>
            <label className="label">
              Alamat
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="4"
              className="input"
              placeholder="Masukkan alamat lengkap"
            />
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

export default ProfileUsaha;
