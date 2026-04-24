import express from 'express';
import { body } from 'express-validator';
import { signup, login, getMe, updateProfile, updateUserPassword, deleteUserAccount } from '../controllers/AuthController.js';
import { protect } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 2 }),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

router.get('/me', protect, getMe);

router.put('/profile', protect, updateProfile);

router.put('/password', protect, updateUserPassword);

router.delete('/account', protect, deleteUserAccount);

export default router;