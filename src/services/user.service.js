import * as UserModel from '../models/user.model.js';
import { hashPassword } from './auth.service.js';

export const getAllUsers = async () => {
  try {
    const users = await UserModel.findAll();
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserById = async (id) => {
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createUser = async (userData) => {
  try {
    // Validate required fields
    const { first_name, last_name, password, role } = userData;
    
    if (!first_name || !last_name || !password) {
      return { success: false, error: 'Missing required fields: first_name, last_name, password' };
    }
    
    // Hash password before storing
    const password_hash = await hashPassword(password);
    
    const userId = await UserModel.create({
      first_name,
      last_name,
      password_hash,
      role: role || 'user'
    });
    
    const newUser = await UserModel.findById(userId);
    return { success: true, data: newUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUser = async (id, userData) => {
  try {
    // Validate required fields
    const { first_name, last_name, password, role } = userData;
    
    if (!first_name || !last_name) {
      return { success: false, error: 'Missing required fields: first_name, last_name' };
    }
    
    // Prepare update data
    const updateData = {
      first_name,
      last_name,
      role: role || 'user'
    };
    
    // Hash password if provided
    if (password) {
      updateData.password_hash = await hashPassword(password);
    } else {
      // Get existing password hash
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        return { success: false, error: 'User not found' };
      }
      updateData.password_hash = existingUser.password_hash;
    }
    
    const affectedRows = await UserModel.update(id, updateData);
    if (affectedRows === 0) {
      return { success: false, error: 'User not found' };
    }
    
    const updatedUser = await UserModel.findById(id);
    return { success: true, data: updatedUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (id) => {
  try {
    const affectedRows = await UserModel.remove(id);
    if (affectedRows === 0) {
      return { success: false, error: 'User not found' };
    }
    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
