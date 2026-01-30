import * as CategoryService from '../services/category.service.js';

export const getAllCategories = async (req, res) => {
  // Users see only their categories, admins see all
  const userId = req.user.role === 'admin' ? null : req.user.user_id;
  const result = await CategoryService.getAllCategories(userId);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
};

export const getCategoryById = async (req, res) => {
  // Users can only see their own categories, admins can see all
  const userId = req.user.role === 'admin' ? null : req.user.user_id;
  const result = await CategoryService.getCategoryById(req.params.id, userId);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(404).json({ error: result.error });
  }
};

export const createCategory = async (req, res) => {
  // Set user_id from authenticated user (users can only create for themselves)
  const categoryData = {
    ...req.body,
    user_id: req.user.role === 'admin' && req.body.user_id ? req.body.user_id : req.user.user_id
  };
  
  const result = await CategoryService.createCategory(categoryData);
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
};

export const updateCategory = async (req, res) => {
  // Users can only update their own categories, admins can update all
  const userId = req.user.role === 'admin' ? null : req.user.user_id;
  const result = await CategoryService.updateCategory(req.params.id, req.body, userId);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
};

export const deleteCategory = async (req, res) => {
  // Users can only delete their own categories, admins can delete all
  const userId = req.user.role === 'admin' ? null : req.user.user_id;
  const result = await CategoryService.deleteCategory(req.params.id, userId);
  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(404).json({ error: result.error });
  }
};
