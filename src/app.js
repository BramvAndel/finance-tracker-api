import 'dotenv/config';
import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth.route.js';
import categoryRouter from './routes/category.route.js';
import expenseRouter from './routes/expense.route.js';
import userRouter from './routes/users.route.js';

import { PORT, CORS_ORIGIN } from "../config.js";

const app = express();
const prefix = '/api/v1';

//middleware
// Rate limiting for auth endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    console.log(`[RATE LIMIT] Auth endpoint blocked for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many attempts from this IP, please try again after 15 minutes'
    });
  }
});

// Rate limiting for general API endpoints (more lenient)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`[RATE LIMIT] API endpoint blocked for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests from this IP, please try again after 15 minutes'
    });
  }
});

// CORS - must be before other middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Apply general rate limiting to all API routes
app.use(`${prefix}/`, apiLimiter);

// routes
// Apply stricter rate limiting to auth routes
app.use(`${prefix}/auth`, authLimiter, authRouter);
app.use(`${prefix}/categories`, categoryRouter); 
app.use(`${prefix}/expenses`, expenseRouter);
app.use(`${prefix}/users`, userRouter);

// start server
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});