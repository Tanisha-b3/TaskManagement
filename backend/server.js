import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
app.get('/', (req, res) => {
  res.send('Welcome to the Task Management API');
});
// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });