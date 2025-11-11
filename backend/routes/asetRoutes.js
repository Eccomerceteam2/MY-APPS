const express = require('express');
const router = express.Router();
const asetController = require('../controllers/asetController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Asset CRUD routes
router.get('/', optionalAuth, asetController.getAllAssets);
router.get('/dashboard', optionalAuth, asetController.getDashboardStats);
router.get('/report', optionalAuth, asetController.generateReport);
router.get('/:id', optionalAuth, asetController.getAssetById);
router.post('/', optionalAuth, asetController.createAsset);
router.put('/:id', optionalAuth, asetController.updateAsset);
router.delete('/:id', optionalAuth, asetController.deleteAsset);
router.get('/:id/depreciation-schedule', optionalAuth, asetController.getDepreciationSchedule);

// Image upload routes
router.post('/:id/upload', authenticateToken, upload.single('image'), asetController.uploadAssetImage);

// Market value routes
router.get('/:id/market-value', optionalAuth, asetController.getMarketValue);

module.exports = router;
