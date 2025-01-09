import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('Missing JWT secrets in environment variables');
}

const generateAccessToken = (user) => jwt.sign({ id: user.id, email: user.email }, JWT_ACCESS_SECRET, { expiresIn: '1h' });
const generateRefreshToken = (user) => jwt.sign({ id: user.id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

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

passport.serializeUser((user, done) => done(null, user.id));
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

    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = refreshToken;
      await user.save();
    }

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 3600 * 1000 });
    res.redirect('http://localhost:5173/');
  } else {
    res.status(403).json({ message: 'Not authenticated' });
  }
};

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is missing' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid or tampered refresh token' });
    }

    const accessToken = generateAccessToken(user);
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600 * 1000 });

    res.status(200).json({ message: 'Access token refreshed successfully' });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the refresh token from the database
    const user = await User.findById(req.user?.id);
    if (user) {
      user.refreshToken = null; // Clear refresh token
      await user.save();
    }

    // Clear cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure secure flag for production
      sameSite: 'strict',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Send response to confirm logout
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Error during logout' });
  }
};

export const validateSession = (req, res) => {
  try {
    // Extract access token from either cookies or Authorization header
    let accessToken = req.cookies?.accessToken;

    if (!accessToken && req.headers.authorization) {
      const authHeader = req.headers.authorization; // e.g., "Bearer <token>"
      if (authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.split(' ')[1]; // Extract token after "Bearer"
      }
    }

    if (!accessToken) {
      return res.status(401).json({ error: 'Access token is missing' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);
    res.status(200).json({ isAuthenticated: true, user: decoded });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token has expired' });
    }
    res.status(401).json({ error: 'Invalid access token' });
  }
};



export default passport;
