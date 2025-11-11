import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaChartLine, FaMoneyBillWave, FaCalendar } from 'react-icons/fa';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/assets/dashboard`);
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  // Prepare chart data
  const categoryData = Object.entries(stats?.category_stats || {}).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value,
  }));

  const COLORS = ['#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#eab308', '#f59e0b'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Ringkasan Aset dan Penyusutan</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="btn btn-primary"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Aset</p>
              <p className="text-3xl font-bold mt-2">{stats?.total_assets || 0}</p>
            </div>
            <FaBox className="text-5xl text-white opacity-20" />
          </div>
        </div>

        <div className="stat-card-secondary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 text-sm font-medium">Nilai Perolehan</p>
              <p className="text-xl font-bold mt-2">
                {formatCurrency(stats?.total_acquisition_cost || 0)}
              </p>
            </div>
            <FaMoneyBillWave className="text-5xl text-white opacity-20" />
          </div>
        </div>

        <div className="stat-card-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Akumulasi Penyusutan</p>
              <p className="text-xl font-bold mt-2">
                {formatCurrency(stats?.total_accumulated_depreciation || 0)}
              </p>
            </div>
            <FaChartLine className="text-5xl text-white opacity-20" />
          </div>
        </div>

        <div className="stat-card-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Nilai Buku</p>
              <p className="text-xl font-bold mt-2">
                {formatCurrency(stats?.total_book_value || 0)}
              </p>
            </div>
            <FaMoneyBillWave className="text-5xl text-white opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Assets by Category */}
        <div className="card">
          <h2 className="card-header">Aset per Kategori</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Jumlah Aset" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Value by Category */}
        <div className="card">
          <h2 className="card-header">Nilai Buku per Kategori</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Assets */}
      <div className="card">
        <h2 className="card-header">Aset Terbaru</h2>
        {stats?.recent_assets && stats.recent_assets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Aset</th>
                  <th>Kategori</th>
                  <th>Tanggal Perolehan</th>
                  <th>Nilai Buku</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_assets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="font-medium">{asset.asset_name}</td>
                    <td>
                      <span className="badge badge-primary">{asset.category}</span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <FaCalendar className="text-gray-400" />
                        <span>{new Date(asset.acquisition_date).toLocaleDateString('id-ID')}</span>
                      </div>
                    </td>
                    <td className="font-semibold text-green-600">
                      {formatCurrency(asset.book_value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Belum ada aset</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
