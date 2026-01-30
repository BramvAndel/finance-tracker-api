import router from 'express';
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} from '../controllers/expense.controller.js';
import { validate, validators } from '../middlewares/validate.js';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';

const expenseRouter = router();

// get all expenses (admin only - users should get their own via /users/:id/expenses)
expenseRouter.get('/', authenticate, isAdmin, getAllExpenses);

//get expense by id (authenticated users - ownership checked in controller)
expenseRouter.get('/:id', authenticate, getExpenseById);

// create expense (authenticated users)
expenseRouter.post('/', authenticate, validate({
  required: ['user_id', 'expense_date', 'amount'],
  types: {
    user_id: 'number',
    amount: 'number',
    expense_date: 'string',
    description: 'string'
  },
  custom: {
    amount: validators.positiveNumber,
    expense_date: validators.dateFormat
  }
}), createExpense);

// update expense (authenticated users - ownership checked in controller)
expenseRouter.put('/:id', authenticate, validate({
  required: ['user_id', 'expense_date', 'amount'],
  types: {
    user_id: 'number',
    amount: 'number',
    expense_date: 'string',
    description: 'string'
  },
  custom: {
    amount: validators.positiveNumber,
    expense_date: validators.dateFormat
  }
}), updateExpense);

// delete expense (authenticated users - ownership checked in controller)
expenseRouter.delete('/:id', authenticate, deleteExpense);

export default expenseRouter;