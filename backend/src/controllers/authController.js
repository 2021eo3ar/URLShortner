import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

// JWT Secrets
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

// Generate Access Token
const generateAccessToken = (user) => {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '1h' });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' }); // 7-day expiry
};

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize User
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize User
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleCallback = passport.authenticate('google', { failureRedirect: '/login' });

export const loginSuccess = async (req, res) => {
  if (req.user) {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    // Save refresh token in database
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = refreshToken;
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

export default passport;


export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // Verify refresh token exists in database
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Issue new access token
    const accessToken = generateAccessToken(user);

    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken,
    });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

export const logout = async (req, res) => {
  if (req.user) {
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        user.refreshToken = null; // Clear stored refresh token
        await user.save();
      }
      req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Error logging out' });
        res.status(200).json({ message: 'Logged out successfully' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error during logout' });
    }
  } else {
    res.status(403).json({ message: 'Not authenticated' });
  }
};
