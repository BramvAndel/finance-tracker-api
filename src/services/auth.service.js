import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../config.js';
import * as UserModel from '../models/user.model.js';

const SALT_ROUNDS = 10;

/**
 * Hash a password
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Register a new user
 */
export const register = async (userData) => {
  try {
    const { first_name, last_name, password, role } = userData;

    // Validate required fields
    if (!first_name || !last_name || !password) {
      return { success: false, error: 'Missing required fields: first_name, last_name, password' };
    }

    // Hash the password
    const password_hash = await hashPassword(password);

    // Create user
    const userId = await UserModel.create({
      first_name,
      last_name,
      password_hash,
      role: role || 'user'
    });

    // Get the created user (without password)
    const user = await UserModel.findById(userId);

    // Generate token
    const token = generateToken({
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role
    });

    return {
      success: true,
      data: {
        user,
        token
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Login user
 */
export const login = async (credentials) => {
  try {
    const { first_name, password } = credentials;

    // Validate required fields
    if (!first_name || !password) {
      return { success: false, error: 'Missing required fields: first_name, password' };
    }

    // Find user by first_name (you might want to add a unique email field in production)
    const [users] = await import('../../db/db.js').then(m => m.db.query(
      'SELECT * FROM users WHERE first_name = ? AND deleted_yn = 0',
      [first_name]
    ));

    if (!users || users.length === 0) {
      return { success: false, error: 'Invalid credentials' };
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Generate token
    const token = generateToken({
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role
    });

    // Remove password from response
    delete user.password_hash;

    return {
      success: true,
      data: {
        user,
        token
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
