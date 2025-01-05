import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from 'passport';
import User from '../models/user.js';

dotenv.config();

// JWT secrets
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your_access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret';

// Function to generate an access token
const generateAccessToken = (user) => {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '1h' }); // 1-hour expiry
};

// Function to generate a refresh token
const generateRefreshToken = (user) => {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '3d' }); // 3-day expiry
};

// Middleware for Google login
export const googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Middleware for Google callback
export const googleCallback = passport.authenticate('google', {
  failureRedirect: '/login',
});

// After successful login, return tokens
export const loginSuccess = async (req, res) => {
  if (req.user) {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    // Optionally store the refresh token in the database
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = refreshToken; // Assuming `refreshToken` is a field in your User model
      await user.save();
    }

    res.status(200).json({
      message: 'Login successful',
      user: req.user,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(403).json({ message: 'Not authenticated' });
  }
};

// Refresh token endpoint
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // Verify the refresh token exists in the database
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user);

    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken,
    });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

// Logout and clear refresh token
export const logout = async (req, res) => {
  if (req.user) {
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        user.refreshToken = null; // Clear refresh token
        await user.save();
      }
      req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Error logging out' });
        res.status(200).json({ message: 'Logged out successfully' });
      });
    } catch (err) {
      res.status(500).json({ message: 'Error logging out' });
    }
  } else {
    res.status(403).json({ message: 'Not authenticated' });
  }
};
