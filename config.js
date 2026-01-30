export const PORT = process.env.PORT || 3000;
export const DB_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// CORS Configuration
export const CORS_ORIGIN = process.env.CORS_ORIGIN || [
  'http://localhost:5173', // Vite default
  'http://localhost:3000', // React default
  'http://localhost:8080', // Vue default
  'http://localhost:4200',  // Angular default
  'http://localhost:5500'
];