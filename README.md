# E-Aset Tracker

Sistem Manajemen Aset Tetap berbasis web yang mengikuti standar PSAK 16 (Pernyataan Standar Akuntansi Keuangan 16 tentang Aset Tetap).

## 🚀 Fitur Utama

- ✅ **CRUD Aset Lengkap** - Tambah, edit, lihat, dan hapus aset
- 📊 **Dashboard Interaktif** - Visualisasi data aset dengan grafik
- 💰 **Perhitungan Penyusutan Otomatis** - Sesuai PSAK 16
- 📈 **Dua Metode Penyusutan**:
  - Metode Garis Lurus (Straight-Line)
  - Metode Saldo Menurun (Declining Balance)
- 📑 **Laporan Lengkap** - Export ke Excel dan PDF
- 🔐 **Autentikasi Sederhana** - Login admin/user
- 📱 **Responsive Design** - Mobile-friendly UI
- 🎨 **Modern UI** - Tailwind CSS dengan tema biru

## 🛠️ Teknologi yang Digunakan

### Backend
- Node.js
- Express.js
- SQLite
- Sequelize ORM

### Frontend
- React.js
- React Router DOM
- Axios
- Tailwind CSS
- Recharts (untuk grafik)
- React Icons
- React-to-Print (export PDF)
- XLSX (export Excel)

## 📁 Struktur Proyek

```
e-aset-tracker/
│
├── backend/
│   ├── server.js                 # Entry point backend
│   ├── package.json              # Dependencies backend
│   ├── db/
│   │   └── aset.db              # SQLite database (auto-generated)
│   ├── models/
│   │   └── asetModel.js         # Model Sequelize untuk aset
│   ├── routes/
│   │   └── asetRoutes.js        # API routes
│   └── controllers/
│       └── asetController.js    # Business logic
│
├── frontend/
│   ├── package.json              # Dependencies frontend
│   ├── tailwind.config.js        # Konfigurasi Tailwind
│   ├── postcss.config.js         # Konfigurasi PostCSS
│   ├── public/
│   │   └── index.html           # HTML template
│   └── src/
│       ├── App.js               # Main app component
│       ├── index.js             # Entry point React
│       ├── components/
│       │   ├── Navbar.js        # Navigation bar
│       │   ├── Sidebar.js       # Sidebar menu
│       │   ├── Dashboard.js     # Dashboard dengan statistik
│       │   ├── AsetList.js      # Daftar aset
│       │   ├── AsetForm.js      # Form tambah/edit aset
│       │   ├── Laporan.js       # Halaman laporan
│       │   └── Login.js         # Halaman login
│       └── styles/
│           └── main.css         # Custom Tailwind styles
│
└── README.md                     # Dokumentasi ini
```

## 🚀 Cara Menjalankan Aplikasi

### Prasyarat
- Node.js (versi 14 atau lebih baru)
- npm atau yarn
- Visual Studio Code (recommended)

### Instalasi dan Menjalankan Backend

1. Buka terminal dan masuk ke folder backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan server:
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

### Instalasi dan Menjalankan Frontend

1. Buka terminal baru dan masuk ke folder frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan aplikasi React:
```bash
npm start
```

Aplikasi akan terbuka otomatis di browser pada `http://localhost:3000`

## 🔑 Login Credentials

Untuk demo, gunakan salah satu kredensial berikut:

- **Admin**: 
  - Username: `admin`
  - Password: `admin123`

- **User**: 
  - Username: `user`
  - Password: `user123`

## 📊 API Endpoints

### Assets
- `GET /api/assets` - Mendapatkan semua aset
- `GET /api/assets/:id` - Mendapatkan detail aset
- `POST /api/assets` - Membuat aset baru
- `PUT /api/assets/:id` - Update aset
- `DELETE /api/assets/:id` - Hapus aset
- `GET /api/assets/:id/depreciation-schedule` - Jadwal penyusutan
- `GET /api/assets/dashboard` - Statistik dashboard
- `GET /api/assets/report` - Generate laporan

### Query Parameters
- `category` - Filter berdasarkan kategori
- `status` - Filter berdasarkan status
- `search` - Pencarian nama aset
- `startDate` & `endDate` - Filter tanggal untuk laporan

## 📖 Standar PSAK 16

Aplikasi ini mengikuti standar PSAK 16 dalam hal:

1. **Pengakuan Aset Tetap**
   - Nilai perolehan (acquisition cost)
   - Masa manfaat (useful life)
   - Nilai residu (residual value)

2. **Metode Penyusutan**
   - **Garis Lurus**: Penyusutan = (Nilai Perolehan - Nilai Residu) / Masa Manfaat
   - **Saldo Menurun**: Penyusutan = Nilai Buku × (2 / Masa Manfaat)

3. **Pengukuran Setelah Pengakuan**
   - Nilai buku = Nilai perolehan - Akumulasi penyusutan
   - Update otomatis setiap periode

## 🎨 Tema dan Desain

- **Warna Utama**: Biru (#3b82f6)
- **Warna Sekunder**: Sky Blue (#0ea5e9)
- **Font**: Inter (Google Fonts)
- **Desain**: Modern, clean, dan user-friendly
- **Responsive**: Mendukung desktop, tablet, dan mobile

## 📱 Fitur Responsive

- Hamburger menu untuk mobile
- Tabel responsif dengan scroll horizontal
- Card layout yang adaptif
- Touch-friendly buttons dan inputs

## 🔧 Ekstensi VS Code yang Direkomendasikan

1. **ESLint** - Linting JavaScript
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - Autocomplete Tailwind
4. **ES7+ React/Redux/React-Native snippets** - React snippets
5. **SQLite Viewer** - Melihat database SQLite

## 📦 Export Fitur

### Export ke Excel
- Format XLSX
- Termasuk summary dan detail aset
- Kolom yang disesuaikan

### Export ke PDF
- Print-friendly layout
- Header dan footer profesional
- Tabel lengkap dengan total

## 🐛 Troubleshooting

### Backend tidak bisa start
- Pastikan port 5000 tidak digunakan aplikasi lain
- Cek apakah semua dependencies sudah terinstall
- Lihat error di console

### Frontend tidak bisa connect ke backend
- Pastikan backend sudah running
- Cek URL API di komponen (default: http://localhost:5000)
- Periksa CORS settings

### Database error
- Database akan dibuat otomatis saat pertama kali backend dijalankan
- Lokasi: `backend/db/aset.db`
- Jika error, hapus file database dan restart backend

## 📝 Catatan Pengembangan

- Database SQLite akan dibuat otomatis di folder `backend/db/`
- Semua perhitungan penyusutan dilakukan di backend
- Frontend menggunakan React Hooks (useState, useEffect)
- Styling menggunakan Tailwind CSS utility classes

## 🤝 Kontribusi

Aplikasi ini dibuat untuk keperluan edukasi dan dapat dikembangkan lebih lanjut sesuai kebutuhan.

## 📄 Lisensi

MIT License - Bebas digunakan untuk keperluan pribadi dan komersial.

## 👨‍💻 Developer

Dikembangkan dengan ❤️ menggunakan React dan Node.js

---

**Selamat menggunakan E-Aset Tracker!** 🎉

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.
