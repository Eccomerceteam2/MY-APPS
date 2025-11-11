const { Asset } = require('../models/asetModel');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Get all assets
exports.getAllAssets = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    
    let whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause.asset_name = {
        [Op.like]: `%${search}%`
      };
    }
    
    const assets = await Asset.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    
    // Update depreciation for each asset
    const updatedAssets = assets.map(asset => {
      const depreciation = asset.calculateDepreciation();
      return {
        ...asset.toJSON(),
        current_accumulated_depreciation: depreciation.accumulated_depreciation,
        current_book_value: depreciation.book_value,
        annual_depreciation: depreciation.annual_depreciation
      };
    });
    
    res.json(updatedAssets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets', message: error.message });
  }
};

// Get single asset by ID
exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    const depreciation = asset.calculateDepreciation();
    const schedule = asset.getDepreciationSchedule();
    
    res.json({
      ...asset.toJSON(),
      current_accumulated_depreciation: depreciation.accumulated_depreciation,
      current_book_value: depreciation.book_value,
      annual_depreciation: depreciation.annual_depreciation,
      depreciation_schedule: schedule
    });
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ error: 'Failed to fetch asset', message: error.message });
  }
};

// Create new asset
exports.createAsset = async (req, res) => {
  try {
    const {
      asset_name,
      category,
      acquisition_date,
      acquisition_cost,
      useful_life,
      depreciation_method,
      residual_value,
      status,
      market_value
    } = req.body;

    // Validate required fields
    if (!asset_name || !category || !acquisition_date || !acquisition_cost || !useful_life) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate serial number
    const serialNumber = `AST-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Generate barcode (simple numeric barcode based on timestamp)
    const barcode = `9${Date.now().toString().slice(-10)}`;

    // Calculate initial book value
    const book_value = parseFloat(acquisition_cost);

    const asset = await Asset.create({
      asset_name,
      category,
      acquisition_date,
      acquisition_cost: parseFloat(acquisition_cost),
      useful_life: parseInt(useful_life),
      depreciation_method: depreciation_method || 'straight-line',
      residual_value: parseFloat(residual_value) || 0,
      book_value,
      accumulated_depreciation: 0,
      status: status || 'active',
      serial_number: serialNumber,
      barcode: barcode,
      market_value: market_value ? parseFloat(market_value) : null,
      user_id: req.user ? req.user.id : null
    });

    const depreciation = asset.calculateDepreciation();

    res.status(201).json({
      ...asset.toJSON(),
      current_accumulated_depreciation: depreciation.accumulated_depreciation,
      current_book_value: depreciation.book_value,
      annual_depreciation: depreciation.annual_depreciation
    });
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({ error: 'Failed to create asset', message: error.message });
  }
};

// Update asset
exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    const {
      asset_name,
      category,
      acquisition_date,
      acquisition_cost,
      useful_life,
      depreciation_method,
      residual_value,
      status
    } = req.body;
    
    // Update fields
    if (asset_name) asset.asset_name = asset_name;
    if (category) asset.category = category;
    if (acquisition_date) asset.acquisition_date = acquisition_date;
    if (acquisition_cost) {
      asset.acquisition_cost = parseFloat(acquisition_cost);
      asset.book_value = parseFloat(acquisition_cost);
    }
    if (useful_life) asset.useful_life = parseInt(useful_life);
    if (depreciation_method) asset.depreciation_method = depreciation_method;
    if (residual_value !== undefined) asset.residual_value = parseFloat(residual_value);
    if (status) asset.status = status;
    
    await asset.save();
    
    const depreciation = asset.calculateDepreciation();
    
    res.json({
      ...asset.toJSON(),
      current_accumulated_depreciation: depreciation.accumulated_depreciation,
      current_book_value: depreciation.book_value,
      annual_depreciation: depreciation.annual_depreciation
    });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ error: 'Failed to update asset', message: error.message });
  }
};

// Delete asset
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    await asset.destroy();
    
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Failed to delete asset', message: error.message });
  }
};

// Get depreciation schedule for an asset
exports.getDepreciationSchedule = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    const schedule = asset.getDepreciationSchedule();
    
    res.json({
      asset_name: asset.asset_name,
      acquisition_cost: asset.acquisition_cost,
      residual_value: asset.residual_value,
      useful_life: asset.useful_life,
      depreciation_method: asset.depreciation_method,
      schedule
    });
  } catch (error) {
    console.error('Error generating depreciation schedule:', error);
    res.status(500).json({ error: 'Failed to generate schedule', message: error.message });
  }
};

// Generate report with summary statistics
exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    let whereClause = { status: 'active' };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (startDate && endDate) {
      whereClause.acquisition_date = {
        [Op.between]: [startDate, endDate]
      };
    }
    
    const assets = await Asset.findAll({ where: whereClause });
    
    let totalAcquisitionCost = 0;
    let totalAccumulatedDepreciation = 0;
    let totalBookValue = 0;
    
    const detailedAssets = assets.map(asset => {
      const depreciation = asset.calculateDepreciation();
      
      totalAcquisitionCost += parseFloat(asset.acquisition_cost);
      totalAccumulatedDepreciation += depreciation.accumulated_depreciation;
      totalBookValue += depreciation.book_value;
      
      return {
        id: asset.id,
        asset_name: asset.asset_name,
        category: asset.category,
        acquisition_date: asset.acquisition_date,
        acquisition_cost: parseFloat(asset.acquisition_cost),
        useful_life: asset.useful_life,
        depreciation_method: asset.depreciation_method,
        residual_value: parseFloat(asset.residual_value),
        accumulated_depreciation: depreciation.accumulated_depreciation,
        book_value: depreciation.book_value,
        annual_depreciation: depreciation.annual_depreciation
      };
    });
    
    // Group by category
    const byCategory = {};
    detailedAssets.forEach(asset => {
      if (!byCategory[asset.category]) {
        byCategory[asset.category] = {
          count: 0,
          total_cost: 0,
          total_depreciation: 0,
          total_book_value: 0
        };
      }
      byCategory[asset.category].count++;
      byCategory[asset.category].total_cost += asset.acquisition_cost;
      byCategory[asset.category].total_depreciation += asset.accumulated_depreciation;
      byCategory[asset.category].total_book_value += asset.book_value;
    });
    
    res.json({
      summary: {
        total_assets: assets.length,
        total_acquisition_cost: Math.round(totalAcquisitionCost * 100) / 100,
        total_accumulated_depreciation: Math.round(totalAccumulatedDepreciation * 100) / 100,
        total_book_value: Math.round(totalBookValue * 100) / 100
      },
      by_category: byCategory,
      assets: detailedAssets,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report', message: error.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const assets = await Asset.findAll({ where: { status: 'active' } });

    let totalAcquisitionCost = 0;
    let totalAccumulatedDepreciation = 0;
    let totalBookValue = 0;

    const categoryStats = {};
    const recentAssets = [];

    assets.forEach(asset => {
      const depreciation = asset.calculateDepreciation();

      totalAcquisitionCost += parseFloat(asset.acquisition_cost);
      totalAccumulatedDepreciation += depreciation.accumulated_depreciation;
      totalBookValue += depreciation.book_value;

      // Category statistics
      if (!categoryStats[asset.category]) {
        categoryStats[asset.category] = { count: 0, value: 0 };
      }
      categoryStats[asset.category].count++;
      categoryStats[asset.category].value += depreciation.book_value;
    });

    // Get 5 most recent assets
    const recent = await Asset.findAll({
      where: { status: 'active' },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    recent.forEach(asset => {
      const depreciation = asset.calculateDepreciation();
      recentAssets.push({
        id: asset.id,
        asset_name: asset.asset_name,
        category: asset.category,
        book_value: depreciation.book_value,
        acquisition_date: asset.acquisition_date
      });
    });

    res.json({
      total_assets: assets.length,
      total_acquisition_cost: Math.round(totalAcquisitionCost * 100) / 100,
      total_accumulated_depreciation: Math.round(totalAccumulatedDepreciation * 100) / 100,
      total_book_value: Math.round(totalBookValue * 100) / 100,
      category_stats: categoryStats,
      recent_assets: recentAssets
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics', message: error.message });
  }
};

// Upload asset image
exports.uploadAssetImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const assetId = req.params.id;
    const asset = await Asset.findByPk(assetId);

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Delete old image if exists
    if (asset.image_url) {
      const oldImagePath = path.join(__dirname, '../uploads', path.basename(asset.image_url));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update asset with new image URL
    const imageUrl = `/uploads/${req.file.filename}`;
    asset.image_url = imageUrl;
    await asset.save();

    res.json({
      message: 'Image uploaded successfully',
      image_url: imageUrl,
      asset: asset
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image', message: error.message });
  }
};

// Get market value for asset
exports.getMarketValue = async (req, res) => {
  try {
    const assetId = req.params.id;
    const asset = await Asset.findByPk(assetId);

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Mock market value calculation (in production, integrate with real market APIs)
    const marketValue = parseFloat(asset.acquisition_cost) * (0.8 + Math.random() * 0.4); // 80-120% of acquisition cost

    // Update asset with market value
    asset.market_value = marketValue;
    await asset.save();

    res.json({
      asset_id: asset.id,
      asset_name: asset.asset_name,
      category: asset.category,
      acquisition_cost: asset.acquisition_cost,
      market_value: Math.round(marketValue * 100) / 100,
      market_premium: Math.round((marketValue - parseFloat(asset.acquisition_cost)) * 100) / 100,
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching market value:', error);
    res.status(500).json({ error: 'Failed to fetch market value', message: error.message });
  }
};
