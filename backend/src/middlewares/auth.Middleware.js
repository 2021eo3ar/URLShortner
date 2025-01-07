import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your_access_token_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret';

/**
 * Middleware to ensure the user is authenticated using the access token.
 */
export const ensureAuthenticated = (req, res, next) => {
  const {accessToken} = req.cookies;
  console.log("the access Token is",accessToken)

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token is missing or invalid' });
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);
    req.user = decoded; // Attach decoded user data to the request object
    next(); // Token is valid, proceed to the next middleware or route
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Access token has expired. Please refresh your token.',
      });
    }
    res.status(401).json({ error: 'Invalid access token' });
  }
};

/**
 * Middleware to ensure the refresh token is valid.
 */
export const ensureRefreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token is missing' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    req.user = decoded; // Attach decoded user data to the request object
    next(); // Token is valid, proceed to the next middleware or route
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};
