import * as CategoryModel from '../models/category.model.js';

export const getAllCategories = async (userId = null) => {
  try {
    const categories = await CategoryModel.findAll(userId);
    return { success: true, data: categories };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCategoryById = async (id, userId = null) => {
  try {
    const category = await CategoryModel.findById(id, userId);
    if (!category) {
      return { success: false, error: 'Category not found' };
    }
    return { success: true, data: category };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createCategory = async (categoryData) => {
  try {
    // Validate required fields
    if (!categoryData.name || !categoryData.user_id) {
      return { success: false, error: 'Missing required fields: name, user_id' };
    }
    
    const categoryId = await CategoryModel.create(categoryData);
    const newCategory = await CategoryModel.findById(categoryId);
    return { success: true, data: newCategory };
  } catch (error) {
    // Check for duplicate category name for user
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Category with this name already exists for this user' };
    }
    return { success: false, error: error.message };
  }
};

export const updateCategory = async (id, categoryData, userId = null) => {
  try {
    // Validate required fields
    if (!categoryData.name) {
      return { success: false, error: 'Missing required field: name' };
    }
    
    // Check if category exists and belongs to user
    const existingCategory = await CategoryModel.findById(id, userId);
    if (!existingCategory) {
      return { success: false, error: 'Category not found' };
    }
    
    const affectedRows = await CategoryModel.update(id, categoryData);
    if (affectedRows === 0) {
      return { success: false, error: 'Category not found' };
    }
    
    const updatedCategory = await CategoryModel.findById(id);
    return { success: true, data: updatedCategory };
  } catch (error) {
    // Check for duplicate category name for user
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Category with this name already exists for this user' };
    }
    return { success: false, error: error.message };
  }
};

export const deleteCategory = async (id, userId = null) => {
  try {
    // Check if category exists and belongs to user
    const existingCategory = await CategoryModel.findById(id, userId);
    if (!existingCategory) {
      return { success: false, error: 'Category not found' };
    }
    
    const affectedRows = await CategoryModel.remove(id);
    if (affectedRows === 0) {
      return { success: false, error: 'Category not found' };
    }
    return { success: true, message: 'Category deleted successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
