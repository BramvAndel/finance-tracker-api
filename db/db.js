// make a db connection using config from config.js
import mysql from 'mysql2/promise';
import { DB_CONFIG } from '../config.js';

export const db = mysql.createPool(DB_CONFIG);