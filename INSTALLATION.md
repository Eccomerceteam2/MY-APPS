# 📦 Panduan Instalasi E-Aset Tracker

Panduan lengkap untuk menginstall dan menjalankan E-Aset Tracker di Visual Studio Code.

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstall:

1. **Node.js** (versi 14 atau lebih baru)
   - Download dari: https://nodejs.org/
   - Verifikasi instalasi: `node --version` dan `npm --version`

2. **Visual Studio Code**
   - Download dari: https://code.visualstudio.com/

3. **Git** (opsional, untuk version control)
   - Download dari: https://git-scm.com/

## 🚀 Langkah-langkah Instalasi

### 1. Buka Proyek di VS Code

1. Buka Visual Studio Code
2. File → Open Folder
3. Pilih folder `e-aset-tracker` atau `FA1`
4. Klik "Select Folder"

### 2. Install Dependencies Backend

1. Buka Terminal di VS Code (Terminal → New Terminal atau Ctrl+`)
2. Navigasi ke folder backend:
   ```bash
   cd backend
   ```

3. Install semua dependencies:
   ```bash
   npm install
   ```

4. Tunggu hingga proses instalasi selesai (biasanya 1-2 menit)

### 3. Install Dependencies Frontend

1. Buka Terminal baru (klik ikon + di panel terminal)
2. Navigasi ke folder frontend:
   ```bash
   cd frontend
   ```

3. Install semua dependencies:
   ```bash
   npm install
   ```

4. Tunggu hingga proses instalasi selesai (biasanya 2-3 menit)

## ▶️ Menjalankan Aplikasi

### Menjalankan Backend

1. Di terminal backend (atau buka terminal baru dan `cd backend`):
   ```bash
   npm start
   ```

2. Anda akan melihat output seperti ini:
   ```
   =================================
   E-Aset Tracker Backend Server
   =================================
   Server running on port 5000
   API URL: http://localhost:5000/api
   Health check: http://localhost:5000/api/health
   =================================
   Database connection established successfully.
   Database synchronized.
   ```

3. **JANGAN TUTUP TERMINAL INI** - Backend harus tetap berjalan

### Menjalankan Frontend

1. Di terminal frontend (atau buka terminal baru dan `cd frontend`):
   ```bash
   npm start
   ```

2. Browser akan otomatis membuka `http://localhost:3000`
3. Jika tidak otomatis, buka browser dan akses `http://localhost:3000`

## 🔐 Login ke Aplikasi

Gunakan salah satu kredensial berikut:

**Admin:**
- Username: `admin`
- Password: `admin123`

**User:**
- Username: `user`
- Password: `user123`

## ✅ Verifikasi Instalasi

### Test Backend API

Buka browser dan akses:
```
http://localhost:5000/api/health
```

Anda harus melihat response JSON:
```json
{
  "status": "OK",
  "message": "E-Aset Tracker API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Frontend

1. Buka `http://localhost:3000`
2. Anda harus melihat halaman login
3. Login dengan kredensial di atas
4. Anda akan diarahkan ke Dashboard

## 🛠️ Ekstensi VS Code yang Direkomendasikan

Install ekstensi berikut untuk pengalaman development yang lebih baik:

1. **ESLint** (dbaeumer.vscode-eslint)
   - Linting JavaScript/React

2. **Prettier - Code formatter** (esbenp.prettier-vscode)
   - Auto-formatting code

3. **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
   - Autocomplete untuk Tailwind classes

4. **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
   - React code snippets

5. **SQLite Viewer** (alexcvzz.vscode-sqlite)
   - Melihat database SQLite

### Cara Install Ekstensi:

1. Klik ikon Extensions di sidebar kiri (atau Ctrl+Shift+X)
2. Cari nama ekstensi
3. Klik "Install"

## 📁 Struktur Folder Setelah Instalasi

```
e-aset-tracker/
│
├── backend/
│   ├── node_modules/          # Dependencies (auto-generated)
│   ├── db/
│   │   └── aset.db           # Database SQLite (auto-generated)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── node_modules/          # Dependencies (auto-generated)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   └── styles/
│   ├── package.json
│   └── tailwind.config.js
│
├── README.md
├── INSTALLATION.md
└── TODO.md
```

## 🐛 Troubleshooting

### Error: Port 5000 sudah digunakan

**Solusi:**
1. Tutup aplikasi yang menggunakan port 5000
2. Atau ubah port di `backend/server.js`:
   ```javascript
   const PORT = process.env.PORT || 5001; // Ganti 5000 ke 5001
   ```
3. Jangan lupa update URL di frontend components jika mengubah port

### Error: Port 3000 sudah digunakan

**Solusi:**
- Ketik `y` saat ditanya "Would you like to run the app on another port instead?"
- Atau tutup aplikasi yang menggunakan port 3000

### Error: npm install gagal

**Solusi:**
1. Hapus folder `node_modules` dan file `package-lock.json`
2. Jalankan `npm cache clean --force`
3. Jalankan `npm install` lagi

### Error: Cannot find module

**Solusi:**
1. Pastikan Anda berada di folder yang benar (backend atau frontend)
2. Jalankan `npm install` lagi
3. Restart VS Code

### Database error

**Solusi:**
1. Hapus file `backend/db/aset.db`
2. Restart backend server
3. Database akan dibuat ulang otomatis

### Frontend tidak bisa connect ke backend

**Solusi:**
1. Pastikan backend sudah running di port 5000
2. Cek console browser untuk error (F12 → Console)
3. Verifikasi URL API di komponen frontend (harus `http://localhost:5000/api`)

## 📝 Tips Development

### Hot Reload

- **Backend**: Gunakan `nodemon` untuk auto-restart
  ```bash
  npm install -g nodemon
  nodemon server.js
  ```

- **Frontend**: Sudah otomatis dengan React (save file = auto reload)

### Debug di VS Code

1. Buka file yang ingin di-debug
2. Set breakpoint (klik di sebelah kiri nomor baris)
3. Tekan F5 atau Run → Start Debugging

### Melihat Database

1. Install ekstensi "SQLite Viewer"
2. Klik kanan file `backend/db/aset.db`
3. Pilih "Open Database"

## 🎯 Langkah Selanjutnya

Setelah instalasi berhasil:

1. ✅ Explore Dashboard
2. ✅ Tambah aset baru
3. ✅ Test perhitungan penyusutan
4. ✅ Generate laporan
5. ✅ Export ke Excel/PDF
6. ✅ Test responsive design (resize browser)

## 📞 Bantuan

Jika mengalami masalah:

1. Cek file `README.md` untuk dokumentasi lengkap
2. Lihat console/terminal untuk error messages
3. Pastikan semua dependencies terinstall dengan benar
4. Restart VS Code dan coba lagi

## 🎉 Selamat!

Anda telah berhasil menginstall E-Aset Tracker!

Aplikasi siap digunakan untuk mengelola aset tetap sesuai standar PSAK 16.

---

**Happy Coding!** 💻✨
