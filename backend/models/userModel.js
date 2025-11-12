const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');

// Initialize SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../db/users.db'),
  logging: false
});

// Define User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [6, 50],
      isLowercase(value) {
        if (!/^[a-z]+$/.test(value)) {
          throw new Error('Username hanya boleh huruf kecil tanpa spasi');
        }
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      isGmail(value) {
        if (!value.endsWith('@gmail.com')) {
          throw new Error('Email harus menggunakan domain @gmail.com');
        }
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [8, 255],
      hasLetterAndNumber(value) {
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        if (!hasLetter || !hasNumber) {
          throw new Error('Password harus menggabungkan huruf dan angka');
        }
      }
    }
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  business_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  business_type: {
    type: DataTypes.ENUM('personal', 'business', 'enterprise'),
    defaultValue: 'personal'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[\+]?[1-9][\d]{0,15}$/
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verification_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reset_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reset_token_expires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.generateVerificationToken = function() {
  this.verification_token = Math.random().toString(36).substring(2) + Date.now().toString(36);
};

User.prototype.generateResetToken = function() {
  this.reset_token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  this.reset_token_expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

module.exports = { User, sequelize };
