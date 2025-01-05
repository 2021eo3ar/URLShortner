import express from 'express';
import dotenv from 'dotenv';
import passport from './config/googleAuth.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

import connectDB from './config/db.js';
import redisClient from './config/redis.js';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoute.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorHandler } from './middlewares/errorHandler.Middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Load and parse Swagger documentation
const swaggerPath = path.resolve('./src/docs/swagger.json');
let swaggerDocument;

try {
  const swaggerFileContent = fs.readFileSync(swaggerPath, 'utf8');
  swaggerDocument = JSON.parse(swaggerFileContent);
} catch (error) {
  console.error('Error loading Swagger documentation:', error.message);
  process.exit(1); // Exit if Swagger file fails to load
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Database Connection
connectDB();

// Redis Connection
redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.error('Redis connection error:', err.message));

// Session Management
app.use(
  session({
    secret: process.env.JWT_SECRET || 'default_secret', // Use a fallback secret for local testing
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production
      httpOnly: true, // Prevent client-side access to the cookie
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    },
  })
);

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/auth', authRoutes);
app.use('/api/short', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handling Middleware
app.use(errorHandler);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
