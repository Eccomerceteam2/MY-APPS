import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaFileExcel, FaFilePdf, FaFilter, FaDownload } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const API_URL = 'http://localhost:5000/api';

function Laporan() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: ''
  });

  const printRef = useRef();
  const categories = ['Tanah', 'Bangunan', 'Mesin', 'Kendaraan', 'Peralatan', 'Furniture', 'Komputer', 'Lainnya'];

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.category) params.category = filters.category;

      const response = await axios.get(`${API_URL}/assets/report`, { params });
      setReport(response.data);
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Gagal membuat laporan');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Laporan_Aset_${new Date().toISOString().split('T')[0]}`,
  });

  const exportToExcel = () => {
    if (!report || !report.assets) return;

    // Prepare data for Excel
    const excelData = report.assets.map(asset => ({
      'Nama Aset': asset.asset_name,
      'Kategori': asset.category,
      'Tanggal Perolehan': new Date(asset.acquisition_date).toLocaleDateString('id-ID'),
      'Nilai Perolehan': asset.acquisition_cost,
      'Masa Manfaat (Tahun)': asset.useful_life,
      'Metode Penyusutan': asset.depreciation_method === 'straight-line' ? 'Garis Lurus' : 'Saldo Menurun',
      'Nilai Residu': asset.residual_value,
      'Akumulasi Penyusutan': asset.accumulated_depreciation,
      'Nilai Buku': asset.book_value,
      'Penyusutan Tahunan': asset.annual_depreciation
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Add summary at the top
    XLSX.utils.sheet_add_aoa(ws, [
      ['LAPORAN ASET TETAP'],
      ['Sesuai PSAK 16'],
      [''],
      ['Total Aset:', report.summary.total_assets],
      ['Total Nilai Perolehan:', report.summary.total_acquisition_cost],
      ['Total Akumulasi Penyusutan:', report.summary.total_accumulated_depreciation],
      ['Total Nilai Buku:', report.summary.total_book_value],
      [''],
    ], { origin: 'A1' });

    // Adjust column widths
    const colWidths = [
      { wch: 30 }, // Nama Aset
      { wch: 15 }, // Kategori
      { wch: 18 }, // Tanggal Perolehan
      { wch: 18 }, // Nilai Perolehan
      { wch: 20 }, // Masa Manfaat
      { wch: 20 }, // Metode Penyusutan
      { wch: 15 }, // Nilai Residu
      { wch: 22 }, // Akumulasi Penyusutan
      { wch: 15 }, // Nilai Buku
      { wch: 20 }, // Penyusutan Tahunan
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Aset');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `Laporan_Aset_${new Date().toISOString().split('T')[0]}.xlsx`);
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Laporan Aset</h1>
          <p className="text-gray-600 mt-1">Laporan lengkap aset dan penyusutan sesuai PSAK 16</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportToExcel}
            className="btn btn-success flex items-center space-x-2"
            disabled={!report || !report.assets || report.assets.length === 0}
          >
            <FaFileExcel />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn btn-primary flex items-center space-x-2"
            disabled={!report || !report.assets || report.assets.length === 0}
          >
            <FaFilePdf />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <h2 className="card-header flex items-center space-x-2">
          <FaFilter />
          <span>Filter Laporan</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Tanggal Mulai</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Tanggal Akhir</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Kategori</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={generateReport}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FaDownload />
            <span>Generate Laporan</span>
          </button>
        </div>
      </div>

      {/* Report Content */}
      {report && (
        <div ref={printRef} className="card">
          {/* Report Header */}
          <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
            <h2 className="text-2xl font-bold text-gray-800">LAPORAN ASET TETAP</h2>
            <p className="text-gray-600 mt-1">Sesuai Standar PSAK 16</p>
            <p className="text-sm text-gray-500 mt-2">
              Tanggal Laporan: {new Date(report.generated_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Aset</p>
              <p className="text-2xl font-bold text-blue-600">{report.summary.total_assets}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Nilai Perolehan</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(report.summary.total_acquisition_cost)}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Akumulasi Penyusutan</p>
              <p className="text-lg font-bold text-red-600">
                {formatCurrency(report.summary.total_accumulated_depreciation)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Nilai Buku</p>
              <p className="text-lg font-bold text-purple-600">
                {formatCurrency(report.summary.total_book_value)}
              </p>
            </div>
          </div>

          {/* By Category Summary */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Ringkasan per Kategori</h3>
            <div className="overflow-x-auto">
              <table className="table text-sm">
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th>Jumlah</th>
                    <th>Total Nilai Perolehan</th>
                    <th>Total Penyusutan</th>
                    <th>Total Nilai Buku</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(report.by_category).map(([category, data]) => (
                    <tr key={category}>
                      <td className="font-medium">{category}</td>
                      <td>{data.count}</td>
                      <td>{formatCurrency(data.total_cost)}</td>
                      <td>{formatCurrency(data.total_depreciation)}</td>
                      <td>{formatCurrency(data.total_book_value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Assets Table */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Detail Aset</h3>
            <div className="overflow-x-auto">
              <table className="table text-sm">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Aset</th>
                    <th>Kategori</th>
                    <th>Tgl Perolehan</th>
                    <th>Nilai Perolehan</th>
                    <th>Metode</th>
                    <th>Akumulasi Penyusutan</th>
                    <th>Nilai Buku</th>
                  </tr>
                </thead>
                <tbody>
                  {report.assets.map((asset, index) => (
                    <tr key={asset.id}>
                      <td>{index + 1}</td>
                      <td className="font-medium">{asset.asset_name}</td>
                      <td>
                        <span className="badge badge-primary text-xs">{asset.category}</span>
                      </td>
                      <td>{new Date(asset.acquisition_date).toLocaleDateString('id-ID')}</td>
                      <td>{formatCurrency(asset.acquisition_cost)}</td>
                      <td className="text-xs">
                        {asset.depreciation_method === 'straight-line' ? 'Garis Lurus' : 'Saldo Menurun'}
                      </td>
                      <td className="text-red-600">{formatCurrency(asset.accumulated_depreciation)}</td>
                      <td className="font-semibold text-green-600">{formatCurrency(asset.book_value)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-bold">
                  <tr>
                    <td colSpan="4" className="text-right">TOTAL:</td>
                    <td>{formatCurrency(report.summary.total_acquisition_cost)}</td>
                    <td></td>
                    <td className="text-red-600">{formatCurrency(report.summary.total_accumulated_depreciation)}</td>
                    <td className="text-green-600">{formatCurrency(report.summary.total_book_value)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t text-sm text-gray-600">
            <p>Catatan: Laporan ini disusun sesuai dengan PSAK 16 tentang Aset Tetap</p>
            <p className="mt-1">Metode penyusutan yang digunakan: Garis Lurus dan Saldo Menurun</p>
          </div>
        </div>
      )}

      {!report && !loading && (
        <div className="card text-center py-12">
          <p className="text-gray-500">Klik "Generate Laporan" untuk membuat laporan</p>
        </div>
      )}
    </div>
  );
}

export default Laporan;
