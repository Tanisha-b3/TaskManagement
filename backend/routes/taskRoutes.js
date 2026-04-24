import express from 'express';
import { body } from 'express-validator';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTaskById);
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required').isLength({ min: 3 }),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
  ],
  createTask
);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;