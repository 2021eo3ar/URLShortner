import express from 'express';
import { createShortURL, redirectShortURL, getUserUrls, deleteUrlById } from '../controllers/urlController.js';
import { validateURLRequest } from '../validators/urlValidator.js';
import { createRateLimiter } from '../middlewares/ratelimiter.middleware.js';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/getUserUrls', ensureAuthenticated, getUserUrls);
router.post('/shortURL', ensureAuthenticated, validateURLRequest, createRateLimiter, createShortURL);
router.get('/:alias', redirectShortURL);
router.delete('/:id', ensureAuthenticated, deleteUrlById);

export default router;
