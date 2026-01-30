import * as ExpenseModel from '../models/expense.model.js';

export const getAllExpenses = async () => {
  try {
    const expenses = await ExpenseModel.findAll();
    return { success: true, data: expenses };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getExpenseById = async (id) => {
  try {
    const expense = await ExpenseModel.findById(id);
    if (!expense) {
      return { success: false, error: 'Expense not found' };
    }
    return { success: true, data: expense };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getExpensesByUserId = async (userId) => {
  try {
    const expenses = await ExpenseModel.findByUserId(userId);
    return { success: true, data: expenses };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createExpense = async (expenseData) => {
  try {
    // Validate required fields
    if (!expenseData.user_id || !expenseData.expense_date || !expenseData.amount) {
      return { success: false, error: 'Missing required fields: user_id, expense_date, amount' };
    }
    
    const expenseId = await ExpenseModel.create(expenseData);
    
    // Add categories if provided
    if (expenseData.category_ids && Array.isArray(expenseData.category_ids)) {
      await ExpenseModel.setCategories(expenseId, expenseData.category_ids);
    }
    
    const newExpense = await ExpenseModel.findById(expenseId);
    return { success: true, data: newExpense };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateExpense = async (id, expenseData) => {
  try {
    // Validate required fields
    if (!expenseData.user_id || !expenseData.expense_date || !expenseData.amount) {
      return { success: false, error: 'Missing required fields: user_id, expense_date, amount' };
    }
    
    const affectedRows = await ExpenseModel.update(id, expenseData);
    if (affectedRows === 0) {
      return { success: false, error: 'Expense not found' };
    }
    
    // Update categories if provided
    if (expenseData.category_ids && Array.isArray(expenseData.category_ids)) {
      await ExpenseModel.setCategories(id, expenseData.category_ids);
    }
    
    const updatedExpense = await ExpenseModel.findById(id);
    return { success: true, data: updatedExpense };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteExpense = async (id) => {
  try {
    const affectedRows = await ExpenseModel.remove(id);
    if (affectedRows === 0) {
      return { success: false, error: 'Expense not found' };
    }
    return { success: true, message: 'Expense deleted successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addCategoryToExpense = async (expenseId, categoryId) => {
  try {
    await ExpenseModel.addCategory(expenseId, categoryId);
    const expense = await ExpenseModel.findById(expenseId);
    return { success: true, data: expense };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeCategoryFromExpense = async (expenseId, categoryId) => {
  try {
    const affectedRows = await ExpenseModel.removeCategory(expenseId, categoryId);
    if (affectedRows === 0) {
      return { success: false, error: 'Category not found for this expense' };
    }
    const expense = await ExpenseModel.findById(expenseId);
    return { success: true, data: expense };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
