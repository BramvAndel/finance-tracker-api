import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from './routes/auth.route.js';
import categoryRouter from './routes/category.route.js';
import expenseRouter from './routes/expense.route.js';
import userRouter from './routes/users.route.js';

import { PORT, CORS_ORIGIN } from "../config.js";

const app = express();
const prefix = '/api/v1';

//middleware
// CORS - must be before other middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.use(`${prefix}/auth`, authRouter);
app.use(`${prefix}/categories`, categoryRouter); 
app.use(`${prefix}/expenses`, expenseRouter);
app.use(`${prefix}/users`, userRouter);

// start server
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});