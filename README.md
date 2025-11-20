# E-Aset Tracker - Static Version

Aplikasi manajemen aset tetap yang sesuai dengan standar PSAK 16, versi statis yang dapat dijalankan langsung di browser tanpa server backend.

## Fitur Utama

- ✅ Manajemen Aset Tetap (CRUD)
- ✅ Perhitungan Penyusutan PSAK 16
  - Metode Garis Lurus (Straight-Line)
  - Metode Saldo Menurun (Declining Balance)
- ✅ Dashboard dengan Statistik
- ✅ Laporan Aset dengan Export Excel
- ✅ Sistem Autentikasi (localStorage)
- ✅ Tema yang dapat dikustomisasi
- ✅ Responsive Design

## Cara Menjalankan

1. Buka file `index.html` di browser web modern
2. Daftar akun baru atau login dengan akun yang sudah ada
3. Mulai kelola aset perusahaan Anda

## Data Storage

Aplikasi ini menggunakan localStorage browser untuk menyimpan:
- Data pengguna
- Data aset
- Laporan masalah
- Pengaturan tema

**Peringatan:** Data akan hilang jika browser cache dikosongkan.

## Teknologi

- React 18 (CDN)
- React Router 6 (CDN)
- Tailwind CSS (CDN)
- Recharts (CDN)
- FileSaver.js (CDN)
- XLSX (CDN)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment ke GitHub Pages

1. Upload semua file di folder `static-app` ke repository GitHub
2. Aktifkan GitHub Pages di Settings repository
3. Aplikasi akan dapat diakses melalui URL GitHub Pages

## Catatan

Versi statis ini tidak memiliki:
- Upload gambar aset
- Email verification
- Database server
- API backend

Untuk fitur lengkap, gunakan versi full-stack dengan Node.js backend.
