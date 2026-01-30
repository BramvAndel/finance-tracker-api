import router from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/users.controller.js';
import { getExpensesByUserId } from '../controllers/expense.controller.js';
import { validate, validators } from '../middlewares/validate.js';
import { authenticate, isAdmin, isOwnerOrAdmin } from '../middlewares/auth.middleware.js';

const userRouter = router();

// get all users (admin only)
userRouter.get('/', authenticate, isAdmin, getAllUsers);

//get user by id (owner or admin)
userRouter.get('/:id', authenticate, isOwnerOrAdmin, getUserById);

// get expenses for a specific user (owner or admin)
userRouter.get('/:id/expenses', authenticate, isOwnerOrAdmin, getExpensesByUserId);

// create user (public - anyone can register)
userRouter.post('/', validate({
  required: ['first_name', 'last_name', 'password'],
  types: {
    first_name: 'string',
    last_name: 'string',
    password: 'string'
  },
  custom: {
    role: validators.role
  }
}), createUser);

// update user (owner or admin)
userRouter.put('/:id', authenticate, isOwnerOrAdmin, validate({
  required: ['first_name', 'last_name'],
  types: {
    first_name: 'string',
    last_name: 'string',
    password: 'string'
  },
  custom: {
    role: validators.role
  }
}), updateUser);

// delete user (admin only)
userRouter.delete('/:id', authenticate, isAdmin, deleteUser);

export default userRouter;