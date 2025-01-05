import express from 'express';
import { 
  googleLogin, 
  googleCallback, 
  loginSuccess, 
  logout, 
  refreshAccessToken 
} from '../controllers/authController.js';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback, loginSuccess);

// Refresh token route
router.post('/refresh', refreshAccessToken);

// Logout route
router.get('/logout', ensureAuthenticated, logout);

export default router;
