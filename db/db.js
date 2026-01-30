// make a db connection using config from config.js
import mysql from 'mysql2/promise';
import { DB_CONFIG } from '../config.js';

// MariaDB-compatible configuration
const poolConfig = {
  ...DB_CONFIG,
  connectionLimit: DB_CONFIG.connectionLimit || 10,
  waitForConnections: DB_CONFIG.waitForConnections !== false,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // MariaDB compatibility flags
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: false,
  // Ensure compatibility with MariaDB's connection handling
  multipleStatements: false
};

// Create connection pool with enhanced error handling
export const db = mysql.createPool(poolConfig);

// Log pool creation
console.log('[DB] MariaDB/MySQL connection pool created');
console.log('[DB] Configuration:', {
  host: DB_CONFIG.host,
  port: DB_CONFIG.port || 3306,
  database: DB_CONFIG.database,
  user: DB_CONFIG.user,
  password: DB_CONFIG.password ? '***hidden***' : 'MISSING!',
  connectionLimit: poolConfig.connectionLimit,
  waitForConnections: poolConfig.waitForConnections,
  supportBigNumbers: poolConfig.supportBigNumbers
});

// Check for missing environment variables
const missingVars = [];
if (!DB_CONFIG.host) missingVars.push('DB_HOST');
if (!DB_CONFIG.user) missingVars.push('DB_USER');
if (!DB_CONFIG.password) missingVars.push('DB_PASS');
if (!DB_CONFIG.database) missingVars.push('DB_NAME');

if (missingVars.length > 0) {
  console.error('[DB] ERROR: Missing required environment variables:', missingVars.join(', '));
  console.error('[DB] Please create a .env file with the following variables:');
  console.error('  DB_HOST=localhost');
  console.error('  DB_USER=your_username');
  console.error('  DB_PASS=your_password');
  console.error('  DB_NAME=your_database');
}

// Test the connection on startup
const testConnection = async () => {
  try {
    console.log('[DB] Testing database connection...');
    const connection = await db.getConnection();
    
    // Get database server version to verify MariaDB/MySQL
    const [rows] = await connection.query('SELECT VERSION() as version');
    const version = rows[0].version;
    const isMariaDB = version.toLowerCase().includes('mariadb');
    
    console.log(`[DB] Successfully connected to ${isMariaDB ? 'MariaDB' : 'MySQL'}`);
    console.log(`[DB] Server version: ${version}`);
    connection.release();
    console.log('[DB] Connection test completed successfully');
  } catch (error) {
    console.error('[DB] Failed to connect to database');
    console.error('[DB] Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      message: error.message
    });
    console.error('[DB] Connection configuration:', {
      host: DB_CONFIG.host,
      port: DB_CONFIG.port || 3306,
      database: DB_CONFIG.database,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password ? '***hidden***' : 'MISSING!'
    });
    
    // Provide specific error guidance
    if (error.code === 'ECONNREFUSED') {
      console.error('[DB] Connection refused. Please check:');
      console.error('  - MySQL server is running');
      console.error('  - Host and port are correct');
      console.error('  - Firewall is not blocking the connection');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('[DB] Access denied. Please check:');
      console.error('  - Username and password are correct');
      console.error('  - User has proper permissions for the database');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('[DB] Database does not exist. Please check:');
      console.error('  - Database name is correct');
      console.error('  - Database has been created');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      console.error('[DB] Connection timeout or host not found. Please check:');
      console.error('  - Network connectivity');
      console.error('  - Host name is correct and resolvable');
    }
    
    console.error('[DB] Application will continue, but database operations will fail');
  }
};

// Run connection test
testConnection();

// Monitor pool events
db.on('connection', (connection) => {
  console.log('[DB] New connection established (ID:', connection.threadId, ')');
});

db.on('acquire', (connection) => {
  console.log('[DB] Connection acquired from pool (ID:', connection.threadId, ')');
});

db.on('release', (connection) => {
  console.log('[DB] Connection released back to pool (ID:', connection.threadId, ')');
});

// Enhanced query wrapper with error logging
export const executeQuery = async (sql, params = []) => {
  const startTime = Date.now();
  try {
    console.log('[DB] Executing query:', sql.substring(0, 100) + (sql.length > 100 ? '...' : ''));
    const [results] = await db.execute(sql, params);
    const duration = Date.now() - startTime;
    console.log(`[DB] Query completed successfully in ${duration}ms`);
    return results;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[DB] Query failed after ${duration}ms`);
    console.error('[DB] Query error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      sql: sql.substring(0, 200) + (sql.length > 200 ? '...' : ''),
      params: params
    });
    throw error;
  }
};