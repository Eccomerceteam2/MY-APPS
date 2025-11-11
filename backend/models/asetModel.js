const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../db/aset.db'),
  logging: false
});

// Define Asset Model following PSAK 16 standards
const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  asset_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['Tanah', 'Bangunan', 'Mesin', 'Kendaraan', 'Peralatan', 'Furniture', 'Komputer', 'Lainnya']]
    }
  },
  acquisition_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  acquisition_cost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  useful_life: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    },
    comment: 'Useful life in years'
  },
  depreciation_method: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'straight-line',
    validate: {
      isIn: [['straight-line', 'declining-balance']]
    }
  },
  residual_value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  book_value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  accumulated_depreciation: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'disposed', 'sold']]
    }
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  serial_number: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  market_value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'assets',
  timestamps: true
});

// Method to calculate depreciation based on PSAK 16
Asset.prototype.calculateDepreciation = function(currentDate = new Date()) {
  const acquisitionDate = new Date(this.acquisition_date);
  const monthsElapsed = Math.floor((currentDate - acquisitionDate) / (1000 * 60 * 60 * 24 * 30.44));
  const yearsElapsed = monthsElapsed / 12;
  
  let depreciationExpense = 0;
  let accumulatedDepreciation = 0;
  let bookValue = parseFloat(this.acquisition_cost);
  
  const depreciableAmount = parseFloat(this.acquisition_cost) - parseFloat(this.residual_value);
  
  if (this.depreciation_method === 'straight-line') {
    // Straight-line method: (Cost - Residual Value) / Useful Life
    const annualDepreciation = depreciableAmount / this.useful_life;
    accumulatedDepreciation = Math.min(annualDepreciation * yearsElapsed, depreciableAmount);
    bookValue = parseFloat(this.acquisition_cost) - accumulatedDepreciation;
    depreciationExpense = annualDepreciation;
  } else if (this.depreciation_method === 'declining-balance') {
    // Declining balance method (double declining): 2 / Useful Life * Book Value
    const rate = 2 / this.useful_life;
    let currentBookValue = parseFloat(this.acquisition_cost);
    
    for (let year = 0; year < Math.floor(yearsElapsed); year++) {
      const yearDepreciation = currentBookValue * rate;
      const maxDepreciation = currentBookValue - parseFloat(this.residual_value);
      const actualDepreciation = Math.min(yearDepreciation, maxDepreciation);
      
      accumulatedDepreciation += actualDepreciation;
      currentBookValue -= actualDepreciation;
      
      if (currentBookValue <= parseFloat(this.residual_value)) {
        break;
      }
    }
    
    bookValue = currentBookValue;
    depreciationExpense = bookValue * rate;
  }
  
  return {
    accumulated_depreciation: Math.round(accumulatedDepreciation * 100) / 100,
    book_value: Math.round(bookValue * 100) / 100,
    annual_depreciation: Math.round(depreciationExpense * 100) / 100
  };
};

// Method to generate depreciation schedule
Asset.prototype.getDepreciationSchedule = function() {
  const schedule = [];
  const depreciableAmount = parseFloat(this.acquisition_cost) - parseFloat(this.residual_value);
  let bookValue = parseFloat(this.acquisition_cost);
  let accumulatedDepreciation = 0;
  
  if (this.depreciation_method === 'straight-line') {
    const annualDepreciation = depreciableAmount / this.useful_life;
    
    for (let year = 1; year <= this.useful_life; year++) {
      const depreciation = Math.min(annualDepreciation, bookValue - parseFloat(this.residual_value));
      accumulatedDepreciation += depreciation;
      bookValue -= depreciation;
      
      schedule.push({
        year: year,
        beginning_book_value: Math.round((bookValue + depreciation) * 100) / 100,
        depreciation_expense: Math.round(depreciation * 100) / 100,
        accumulated_depreciation: Math.round(accumulatedDepreciation * 100) / 100,
        ending_book_value: Math.round(bookValue * 100) / 100
      });
    }
  } else if (this.depreciation_method === 'declining-balance') {
    const rate = 2 / this.useful_life;
    
    for (let year = 1; year <= this.useful_life; year++) {
      const beginningBookValue = bookValue;
      const depreciation = Math.min(bookValue * rate, bookValue - parseFloat(this.residual_value));
      
      if (depreciation <= 0) break;
      
      accumulatedDepreciation += depreciation;
      bookValue -= depreciation;
      
      schedule.push({
        year: year,
        beginning_book_value: Math.round(beginningBookValue * 100) / 100,
        depreciation_expense: Math.round(depreciation * 100) / 100,
        accumulated_depreciation: Math.round(accumulatedDepreciation * 100) / 100,
        ending_book_value: Math.round(bookValue * 100) / 100
      });
      
      if (bookValue <= parseFloat(this.residual_value)) break;
    }
  }
  
  return schedule;
};

// Import User model for associations
const { User } = require('./userModel');

// Initialize database
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { Asset, sequelize, initDatabase };
