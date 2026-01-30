import * as ExpenseService from '../services/expense.service.js';

export const getAllExpenses = async (req, res) => {
  const result = await ExpenseService.getAllExpenses();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
};

export const getExpenseById = async (req, res) => {
  const result = await ExpenseService.getExpenseById(req.params.id);
  
  // Check ownership: users can only see their own expenses, admins can see all
  if (result.success) {
    if (req.user.role !== 'admin' && result.data.user_id !== req.user.user_id) {
      return res.status(403).json({ error: 'Access denied. You can only access your own expenses.' });
    }
    res.status(200).json(result.data);
  } else {
    res.status(404).json({ error: result.error });
  }
};

export const createExpense = async (req, res) => {
  // Users can only create expenses for themselves unless they're admin
  if (req.user.role !== 'admin' && req.body.user_id !== req.user.user_id) {
    return res.status(403).json({ error: 'Access denied. You can only create expenses for yourself.' });
  }
  
  const result = await ExpenseService.createExpense(req.body);
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
};

export const updateExpense = async (req, res) => {
  // First get the expense to check ownership
  const expenseResult = await ExpenseService.getExpenseById(req.params.id);
  
  if (!expenseResult.success) {
    return res.status(404).json({ error: expenseResult.error });
  }
  
  // Check ownership
  if (req.user.role !== 'admin' && expenseResult.data.user_id !== req.user.user_id) {
    return res.status(403).json({ error: 'Access denied. You can only update your own expenses.' });
  }
  
  const result = await ExpenseService.updateExpense(req.params.id, req.body);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
};

export const deleteExpense = async (req, res) => {
  // First get the expense to check ownership
  const expenseResult = await ExpenseService.getExpenseById(req.params.id);
  
  if (!expenseResult.success) {
    return res.status(404).json({ error: expenseResult.error });
  }
  
  // Check ownership
  if (req.user.role !== 'admin' && expenseResult.data.user_id !== req.user.user_id) {
    return res.status(403).json({ error: 'Access denied. You can only delete your own expenses.' });
  }
  
  const result = await ExpenseService.deleteExpense(req.params.id);
  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(404).json({ error: result.error });
  }
};

export const getExpensesByUserId = async (req, res) => {
  const userId = parseInt(req.params.id);
  
  // Users can only see their own expenses, admins can see all
  if (req.user.role !== 'admin' && req.user.user_id !== userId) {
    return res.status(403).json({ error: 'Access denied. You can only access your own expenses.' });
  }
  
  const result = await ExpenseService.getExpensesByUserId(userId);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
};
