# 🚀 How to Run E-Aset Tracker

## Quick Run (After Installation)

### Step 1: Open Two Terminals in VS Code

Press `` Ctrl + ` `` to open terminal, then click the `+` icon to open a second terminal.

### Step 2: Start Backend (Terminal 1)

```bash
cd backend
npm start
```

**Expected Output:**
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

✅ **Backend is ready when you see this!**

### Step 3: Start Frontend (Terminal 2)

```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view e-aset-tracker-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

✅ **Frontend is ready! Browser will open automatically.**

### Step 4: Login

The browser will automatically open `http://localhost:3000`

**Login Credentials:**
- Username: `admin`
- Password: `admin123`

## 🎯 What to Do After Login

### 1. Explore Dashboard
- View statistics
- Check charts
- See recent assets

### 2. Add Your First Asset
1. Click "Daftar Aset" in sidebar
2. Click "Tambah Aset" button
3. Fill in the form:
   ```
   Nama Aset: Laptop Dell XPS 15
   Kategori: Komputer
   Tanggal Perolehan: 2024-01-15
   Nilai Perolehan: 25000000
   Masa Manfaat: 4
   Metode Penyusutan: Garis Lurus
   Nilai Residu: 2000000
   ```
4. Click "Simpan"

### 3. View Asset Details
1. Go to "Daftar Aset"
2. Click the eye icon (👁️) on any asset
3. See depreciation schedule

### 4. Generate Report
1. Click "Laporan" in sidebar
2. Click "Generate Laporan"
3. Try "Export Excel" or "Print PDF"

## 🛑 How to Stop

Press `Ctrl + C` in both terminals to stop the servers.

## 🔄 How to Restart

Just run the same commands again:

**Terminal 1:**
```bash
cd backend
npm start
```

**Terminal 2:**
```bash
cd frontend
npm start
```

## 📱 Access from Other Devices

### On Same Network

1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `ip addr`

2. On other device, open browser and go to:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

**Example:** `http://192.168.1.100:3000`

## 🐛 Common Issues

### Issue: Port 5000 already in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: Port 3000 already in use

**Solution:**
When prompted, type `y` to run on another port.

### Issue: Cannot connect to backend

**Check:**
1. Backend is running (Terminal 1)
2. No errors in backend console
3. Try: `http://localhost:5000/api/health`

### Issue: White screen on frontend

**Solution:**
1. Check browser console (F12)
2. Clear browser cache
3. Restart frontend server

## 📊 Test the Application

### Test 1: Add Asset
- Add a new asset
- Check if it appears in list
- Verify calculations

### Test 2: Edit Asset
- Click edit icon
- Modify some fields
- Save and verify changes

### Test 3: View Details
- Click eye icon
- Check depreciation schedule
- Verify all data

### Test 4: Generate Report
- Go to Laporan
- Generate report
- Export to Excel
- Export to PDF

### Test 5: Responsive Design
- Resize browser window
- Check mobile view
- Test hamburger menu

## 🎨 Customize (Optional)

### Change Port

**Backend (server.js):**
```javascript
const PORT = process.env.PORT || 5001; // Change 5000 to 5001
```

**Frontend (package.json):**
```json
"scripts": {
  "start": "PORT=3001 react-scripts start"
}
```

### Change Colors

**Frontend (tailwind.config.js):**
```javascript
colors: {
  primary: {
    500: '#your-color-here'
  }
}
```

## 📈 Monitor Application

### Backend Logs
Watch Terminal 1 for:
- API requests
- Database operations
- Errors

### Frontend Logs
Open browser console (F12) to see:
- Component renders
- API calls
- Errors

### Database
View database file:
- Location: `backend/db/aset.db`
- Use SQLite Viewer extension in VS Code

## 🔐 Security Notes

**For Production:**
1. Change default passwords
2. Add proper authentication
3. Use environment variables
4. Enable HTTPS
5. Add rate limiting
6. Implement proper session management

**Current Setup:**
- Demo credentials only
- Local development only
- Not production-ready security

## 📚 Additional Resources

- **Full Documentation:** README.md
- **Installation Guide:** INSTALLATION.md
- **Quick Start:** QUICKSTART.md
- **Project Overview:** PROJECT_SUMMARY.md
- **Verification:** VERIFICATION_CHECKLIST.md

## 💡 Tips

1. **Keep terminals open** while using the app
2. **Watch for errors** in both terminals
3. **Refresh browser** if something looks wrong
4. **Check console** (F12) for frontend errors
5. **Restart servers** if things get stuck

## 🎉 Enjoy!

You're all set! The application is now running and ready to use.

**Happy Asset Tracking!** 📊✨

---

**Need Help?**
- Check README.md for detailed documentation
- Review INSTALLATION.md for setup issues
- See VERIFICATION_CHECKLIST.md for testing
