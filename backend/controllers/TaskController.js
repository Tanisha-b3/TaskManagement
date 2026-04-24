import Task from '../models/Task.js';
import sequelize from '../config/database.js';
import { validationResult } from 'express-validator';
import { Sequelize } from 'sequelize';

export const getTasks = async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 10 } = req.query;
    const where = { userId: req.user.id };
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    
    const offset = (page - 1) * limit;
    
    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      tasks,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ success: true, task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });
    
    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await task.update(req.body);
    
    res.json({ success: true, task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await task.destroy();
    
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.findAll({
      where: { userId: req.user.id },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const result = {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      highPriority: 0
    };

    stats.forEach(stat => {
      const status = stat.status;
      const count = parseInt(stat.dataValues.count);
      result.total += count;
      if (status === 'pending') result.pending = count;
      if (status === 'in-progress') result.inProgress = count;
      if (status === 'completed') result.completed = count;
    });

    const highPriorityCount = await Task.count({
      where: { userId: req.user.id, priority: 'high' }
    });
    result.highPriority = highPriorityCount;

    res.json(result);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};