const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

// Create a new issue report
router.post('/issues', authenticateToken, reportController.createIssue);

// Get user's reports
router.get('/user', authenticateToken, reportController.getUserReports);

// Get all reports (admin only - you might want to add admin middleware)
router.get('/all', authenticateToken, reportController.getAllReports);

// Update report status (admin only)
router.put('/:id/status', authenticateToken, reportController.updateReportStatus);

module.exports = router;
