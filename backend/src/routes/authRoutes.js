import express from 'express';
import { googleLogin, googleCallback, loginSuccess, logout, getUserData } from '../controllers/authController.js';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/google', googleLogin);
router.get('/google/callback', googleCallback, loginSuccess);
router.get('/logout', logout);
router.get('/user', ensureAuthenticated, getUserData);

export default router;
