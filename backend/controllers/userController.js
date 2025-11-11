const { User } = require('../models/userModel');
const { generateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Register new user
exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      full_name,
      business_name,
      business_type,
      phone,
      address
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists with this email or username'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      full_name,
      business_name,
      business_type,
      phone,
      address
    });

    // Generate verification token
    user.generateVerificationToken();
    await user.save();

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data (exclude password)
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      business_name: user.business_name,
      business_type: user.business_type,
      phone: user.phone,
      address: user.address,
      is_verified: user.is_verified,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.checkPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({
        error: 'Email not verified',
        message: 'Please verify your email before logging in',
        verification_token: user.verification_token
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data (exclude password)
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      business_name: user.business_name,
      business_type: user.business_type,
      phone: user.phone,
      address: user.address,
      is_verified: user.is_verified
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      business_name: user.business_name,
      business_type: user.business_type,
      phone: user.phone,
      address: user.address,
      is_verified: user.is_verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const {
      username,
      email,
      full_name,
      business_name,
      business_type,
      phone,
      address
    } = req.body;

    // Check for uniqueness if username or email is being updated
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({
        where: { username: username }
      });
      if (existingUsername) {
        return res.status(400).json({
          error: 'Username already exists'
        });
      }
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        where: { email: email }
      });
      if (existingEmail) {
        return res.status(400).json({
          error: 'Email already exists'
        });
      }
    }

    // Update user
    await user.update({
      username: username || user.username,
      email: email || user.email,
      full_name: full_name || user.full_name,
      business_name,
      business_type,
      phone,
      address
    });

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      business_name: user.business_name,
      business_type: user.business_type,
      phone: user.phone,
      address: user.address,
      is_verified: user.is_verified
    };

    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: { verification_token: token }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    user.is_verified = true;
    user.verification_token = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      error: 'Email verification failed',
      message: error.message
    });
  }
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.generateResetToken();
    await user.save();

    // In production, send email with reset token
    // For now, just return the token for testing
    res.json({
      message: 'Password reset token generated',
      reset_token: user.reset_token
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      error: 'Failed to request password reset',
      message: error.message
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expires: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      error: 'Failed to reset password',
      message: error.message
    });
  }
};
