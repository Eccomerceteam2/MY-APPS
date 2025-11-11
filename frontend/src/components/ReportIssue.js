import React, { useState } from 'react';
import axios from 'axios';
import { FaSave, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

function ReportIssue() {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'bug',
    description: '',
    priority: 'medium'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'bug', label: 'Bug/Error' },
    { value: 'feature', label: 'Fitur Baru' },
    { value: 'improvement', label: 'Perbaikan' },
    { value: 'question', label: 'Pertanyaan' },
    { value: 'other', label: 'Lainnya' }
  ];

  const priorities = [
    { value: 'low', label: 'Rendah' },
    { value: 'medium', label: 'Sedang' },
    { value: 'high', label: 'Tinggi' },
    { value: 'urgent', label: 'Mendesak' }
  ];

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

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subjek harus diisi';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi harus diisi';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Deskripsi minimal 10 karakter';
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

      const response = await axios.post(`${API_URL}/reports/issues`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Laporan berhasil dikirim! Tim kami akan segera menangani masalah Anda.');
      setFormData({
        subject: '',
        category: 'bug',
        description: '',
        priority: 'medium'
      });
    } catch (err) {
      console.error('Error submitting report:', err);
      alert('Gagal mengirim laporan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <FaExclamationTriangle className="text-orange-500 text-2xl" />
          <h1 className="text-3xl font-bold text-gray-800">
            Laporkan Masalah
          </h1>
        </div>
        <p className="text-gray-600">
          Laporkan bug, saran perbaikan, atau masalah yang Anda alami
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Subject */}
          <div>
            <label className="label">
              Subjek <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`input ${errors.subject ? 'input-error' : ''}`}
              placeholder="Ringkasan masalah yang Anda alami"
            />
            {errors.subject && (
              <p className="error-message">{errors.subject}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="label">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="label">
              Prioritas <span className="text-red-500">*</span>
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input"
            >
              {priorities.map(pri => (
                <option key={pri.value} value={pri.value}>
                  {pri.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="label">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className={`input ${errors.description ? 'input-error' : ''}`}
              placeholder="Jelaskan secara detail masalah yang Anda alami, langkah-langkah untuk mereproduksi, dan dampaknya..."
            />
            {errors.description && (
              <p className="error-message">{errors.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Semakin detail deskripsi Anda, semakin cepat kami dapat membantu menyelesaikan masalah.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Informasi Penting</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Laporan Anda akan ditinjau oleh tim developer</li>
              <li>• Kami akan memberikan update melalui email jika diperlukan</li>
              <li>• Untuk masalah mendesak, hubungi support langsung</li>
              <li>• Pastikan data sensitif tidak disertakan dalam laporan</li>
            </ul>
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
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Kirim Laporan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReportIssue;
