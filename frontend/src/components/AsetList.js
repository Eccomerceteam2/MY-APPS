import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaFilter } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

function AsetList() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const categories = ['Tanah', 'Bangunan', 'Mesin', 'Kendaraan', 'Peralatan', 'Furniture', 'Komputer', 'Lainnya'];

  useEffect(() => {
    fetchAssets();
  }, [filterCategory]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterCategory) params.category = filterCategory;
      
      const response = await axios.get(`${API_URL}/assets`, { params });
      setAssets(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Gagal memuat data aset');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus aset ini?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/assets/${id}`);
      fetchAssets();
      alert('Aset berhasil dihapus');
    } catch (err) {
      console.error('Error deleting asset:', err);
      alert('Gagal menghapus aset');
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/assets/${id}`);
      setSelectedAsset(response.data);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error fetching asset detail:', err);
      alert('Gagal memuat detail aset');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredAssets = assets.filter(asset =>
    asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Daftar Aset</h1>
          <p className="text-gray-600 mt-1">Kelola semua aset perusahaan</p>
        </div>
        <button
          onClick={() => navigate('/assets/new')}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Tambah Aset</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama aset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input pl-10"
            >
              <option value="">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Assets Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nama Aset</th>
                <th>Kategori</th>
                <th>Tanggal Perolehan</th>
                <th>Nilai Perolehan</th>
                <th>Nilai Buku</th>
                <th>Metode Penyusutan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="font-medium">{asset.asset_name}</td>
                    <td>
                      <span className="badge badge-primary">{asset.category}</span>
                    </td>
                    <td>{new Date(asset.acquisition_date).toLocaleDateString('id-ID')}</td>
                    <td>{formatCurrency(asset.acquisition_cost)}</td>
                    <td className="font-semibold text-green-600">
                      {formatCurrency(asset.current_book_value || asset.book_value)}
                    </td>
                    <td>
                      <span className="badge badge-secondary">
                        {asset.depreciation_method === 'straight-line' ? 'Garis Lurus' : 'Saldo Menurun'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetail(asset.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Lihat Detail"
                        >
                          <FaEye className="text-lg" />
                        </button>
                        <button
                          onClick={() => navigate(`/assets/edit/${asset.id}`)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    {searchTerm || filterCategory ? 'Tidak ada aset yang sesuai dengan pencarian' : 'Belum ada aset'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAsset && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Detail Aset</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Aset</p>
                    <p className="font-semibold">{selectedAsset.asset_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kategori</p>
                    <p className="font-semibold">{selectedAsset.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Perolehan</p>
                    <p className="font-semibold">
                      {new Date(selectedAsset.acquisition_date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nilai Perolehan</p>
                    <p className="font-semibold">{formatCurrency(selectedAsset.acquisition_cost)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Masa Manfaat</p>
                    <p className="font-semibold">{selectedAsset.useful_life} tahun</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Metode Penyusutan</p>
                    <p className="font-semibold">
                      {selectedAsset.depreciation_method === 'straight-line' ? 'Garis Lurus' : 'Saldo Menurun'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nilai Residu</p>
                    <p className="font-semibold">{formatCurrency(selectedAsset.residual_value)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Akumulasi Penyusutan</p>
                    <p className="font-semibold text-red-600">
                      {formatCurrency(selectedAsset.current_accumulated_depreciation)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nilai Buku Saat Ini</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(selectedAsset.current_book_value)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Penyusutan Tahunan</p>
                    <p className="font-semibold">{formatCurrency(selectedAsset.annual_depreciation)}</p>
                  </div>
                </div>

                {/* Depreciation Schedule */}
                {selectedAsset.depreciation_schedule && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-3">Jadwal Penyusutan</h3>
                    <div className="overflow-x-auto">
                      <table className="table text-sm">
                        <thead>
                          <tr>
                            <th>Tahun</th>
                            <th>Nilai Buku Awal</th>
                            <th>Beban Penyusutan</th>
                            <th>Akumulasi</th>
                            <th>Nilai Buku Akhir</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAsset.depreciation_schedule.map((item) => (
                            <tr key={item.year}>
                              <td>{item.year}</td>
                              <td>{formatCurrency(item.beginning_book_value)}</td>
                              <td>{formatCurrency(item.depreciation_expense)}</td>
                              <td>{formatCurrency(item.accumulated_depreciation)}</td>
                              <td>{formatCurrency(item.ending_book_value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="btn btn-secondary"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AsetList;
