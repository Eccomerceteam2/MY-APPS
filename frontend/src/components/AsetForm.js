import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaTimes } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

function AsetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    asset_name: '',
    category: '',
    acquisition_date: '',
    acquisition_cost: '',
    useful_life: '',
    depreciation_method: 'straight-line',
    residual_value: '0',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const categories = ['Tanah', 'Bangunan', 'Mesin', 'Kendaraan', 'Peralatan', 'Furniture', 'Komputer', 'Lainnya'];

  useEffect(() => {
    if (isEditMode) {
      fetchAsset();
    }
  }, [id]);

  const fetchAsset = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(`${API_URL}/assets/${id}`);
      const asset = response.data;
      
      setFormData({
        asset_name: asset.asset_name,
        category: asset.category,
        acquisition_date: asset.acquisition_date,
        acquisition_cost: asset.acquisition_cost,
        useful_life: asset.useful_life,
        depreciation_method: asset.depreciation_method,
        residual_value: asset.residual_value,
        status: asset.status
      });
    } catch (err) {
      console.error('Error fetching asset:', err);
      alert('Gagal memuat data aset');
      navigate('/assets');
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

    if (!formData.asset_name.trim()) {
      newErrors.asset_name = 'Nama aset harus diisi';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori harus dipilih';
    }

    if (!formData.acquisition_date) {
      newErrors.acquisition_date = 'Tanggal perolehan harus diisi';
    }

    if (!formData.acquisition_cost || parseFloat(formData.acquisition_cost) <= 0) {
      newErrors.acquisition_cost = 'Nilai perolehan harus lebih dari 0';
    }

    if (!formData.useful_life || parseInt(formData.useful_life) <= 0) {
      newErrors.useful_life = 'Masa manfaat harus lebih dari 0';
    }

    if (parseFloat(formData.residual_value) < 0) {
      newErrors.residual_value = 'Nilai residu tidak boleh negatif';
    }

    if (parseFloat(formData.residual_value) >= parseFloat(formData.acquisition_cost)) {
      newErrors.residual_value = 'Nilai residu harus lebih kecil dari nilai perolehan';
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

      if (isEditMode) {
        await axios.put(`${API_URL}/assets/${id}`, formData);
        alert('Aset berhasil diperbarui');
      } else {
        await axios.post(`${API_URL}/assets`, formData);
        alert('Aset berhasil ditambahkan');
      }

      navigate('/assets');
    } catch (err) {
      console.error('Error saving asset:', err);
      alert('Gagal menyimpan aset: ' + (err.response?.data?.message || err.message));
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
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? 'Edit Aset' : 'Tambah Aset Baru'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode ? 'Perbarui informasi aset' : 'Masukkan informasi aset sesuai PSAK 16'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Asset Name */}
          <div>
            <label className="label">
              Nama Aset <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="asset_name"
              value={formData.asset_name}
              onChange={handleChange}
              className={`input ${errors.asset_name ? 'input-error' : ''}`}
              placeholder="Contoh: Laptop Dell XPS 15"
            />
            {errors.asset_name && (
              <p className="error-message">{errors.asset_name}</p>
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
              className={`input ${errors.category ? 'input-error' : ''}`}
            >
              <option value="">Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="error-message">{errors.category}</p>
            )}
          </div>

          {/* Acquisition Date and Cost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                Tanggal Perolehan <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="acquisition_date"
                value={formData.acquisition_date}
                onChange={handleChange}
                className={`input ${errors.acquisition_date ? 'input-error' : ''}`}
              />
              {errors.acquisition_date && (
                <p className="error-message">{errors.acquisition_date}</p>
              )}
            </div>

            <div>
              <label className="label">
                Nilai Perolehan (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="acquisition_cost"
                value={formData.acquisition_cost}
                onChange={handleChange}
                className={`input ${errors.acquisition_cost ? 'input-error' : ''}`}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {errors.acquisition_cost && (
                <p className="error-message">{errors.acquisition_cost}</p>
              )}
            </div>
          </div>

          {/* Useful Life and Depreciation Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                Masa Manfaat (Tahun) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="useful_life"
                value={formData.useful_life}
                onChange={handleChange}
                className={`input ${errors.useful_life ? 'input-error' : ''}`}
                placeholder="0"
                min="1"
              />
              {errors.useful_life && (
                <p className="error-message">{errors.useful_life}</p>
              )}
            </div>

            <div>
              <label className="label">
                Metode Penyusutan <span className="text-red-500">*</span>
              </label>
              <select
                name="depreciation_method"
                value={formData.depreciation_method}
                onChange={handleChange}
                className="input"
              >
                <option value="straight-line">Garis Lurus (Straight-Line)</option>
                <option value="declining-balance">Saldo Menurun (Declining Balance)</option>
              </select>
            </div>
          </div>

          {/* Residual Value */}
          <div>
            <label className="label">
              Nilai Residu (Rp)
            </label>
            <input
              type="number"
              name="residual_value"
              value={formData.residual_value}
              onChange={handleChange}
              className={`input ${errors.residual_value ? 'input-error' : ''}`}
              placeholder="0"
              min="0"
              step="0.01"
            />
            {errors.residual_value && (
              <p className="error-message">{errors.residual_value}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Nilai residu adalah estimasi nilai aset pada akhir masa manfaatnya
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="label">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="active">Aktif</option>
              <option value="disposed">Dilepas</option>
              <option value="sold">Dijual</option>
            </select>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Informasi PSAK 16</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Metode Garis Lurus: Penyusutan sama setiap tahun</li>
              <li>• Metode Saldo Menurun: Penyusutan lebih besar di awal periode</li>
              <li>• Nilai Residu: Estimasi nilai aset di akhir masa manfaat</li>
              <li>• Masa Manfaat: Periode aset diharapkan dapat digunakan</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/assets')}
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
                  <span>{isEditMode ? 'Perbarui' : 'Simpan'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AsetForm;
