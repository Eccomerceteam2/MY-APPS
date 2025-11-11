const { Report } = require('../models/reportModel');
const { User } = require('../models/userModel');

// Create a new issue report
exports.createIssue = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject, category, description, priority } = req.body;

    // Create the report
    const report = await Report.create({
      user_id: userId,
      subject,
      category,
      description,
      priority,
      status: 'open'
    });

    res.status(201).json({
      message: 'Issue report created successfully',
      report: {
        id: report.id,
        subject: report.subject,
        category: report.category,
        priority: report.priority,
        status: report.status,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({
      error: 'Failed to create issue report',
      message: error.message
    });
  }
};

// Get user's reports
exports.getUserReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const reports = await Report.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      reports: reports.map(report => ({
        id: report.id,
        subject: report.subject,
        category: report.category,
        priority: report.priority,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get user reports error:', error);
    res.status(500).json({
      error: 'Failed to fetch reports',
      message: error.message
    });
  }
};

// Get all reports (admin only)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'full_name']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      reports: reports.map(report => ({
        id: report.id,
        subject: report.subject,
        category: report.category,
        description: report.description,
        priority: report.priority,
        status: report.status,
        user: report.user,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all reports error:', error);
    res.status(500).json({
      error: 'Failed to fetch reports',
      message: error.message
    });
  }
};

// Update report status (admin only)
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body;

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await report.update({
      status,
      resolution: resolution || report.resolution
    });

    res.json({
      message: 'Report updated successfully',
      report: {
        id: report.id,
        status: report.status,
        resolution: report.resolution,
        updatedAt: report.updatedAt
      }
    });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({
      error: 'Failed to update report',
      message: error.message
    });
  }
};
