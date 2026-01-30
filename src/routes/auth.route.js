import router from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';

const authRouter = router();

// Register new user
authRouter.post('/register', validate({
  required: ['first_name', 'last_name', 'password'],
  types: {
    first_name: 'string',
    last_name: 'string',
    password: 'string'
  }
}), register);

// Login user
authRouter.post('/login', validate({
  required: ['first_name', 'password'],
  types: {
    first_name: 'string',
    password: 'string'
  }
}), login);

// Logout user
authRouter.post('/logout', logout);

export default authRouter;
