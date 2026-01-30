import router from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const categoryRouter = router();

// get all categories (authenticated users see their own, admins see all)
categoryRouter.get('/', authenticate, getAllCategories);

//get category by id (authenticated users)
categoryRouter.get('/:id', authenticate, getCategoryById);

// create category (authenticated users can create their own)
categoryRouter.post('/', authenticate, validate({
  required: ['name'],
  types: {
    name: 'string',
    description: 'string'
  }
}), createCategory);

// update category (authenticated users can update their own)
categoryRouter.put('/:id', authenticate, validate({
  required: ['name'],
  types: {
    name: 'string',
    description: 'string'
  }
}), updateCategory);

// delete category (authenticated users can delete their own)
categoryRouter.delete('/:id', authenticate, deleteCategory);

export default categoryRouter;