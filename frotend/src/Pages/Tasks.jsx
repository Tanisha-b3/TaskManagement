// frontend/src/pages/Tasks.jsx
import React, { useState, useEffect } from 'react';
import { getTasks, updateTaskStatus, deleteTask } from '../services/api';
import TaskList from '../Tasks/TaskList';
import Loader from '../components/Loader';

const Tasks = ({ onEditTask, onNewTask }) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getTasks({ page: pagination.page, ...filters });
      setTasks(data.tasks || []);
      setPagination({
        page: data.page,
        total: data.total,
        pages: data.totalPages,
      });
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleEditTask = (task) => {
    if (onEditTask) {
      onEditTask(task.id);
    }
  };

  const handleFilter = async (filters) => {
    await fetchTasks(filters);
  };

  if (loading) return <Loader />;

  return (
    <TaskList
      tasks={tasks}
      onStatusChange={handleStatusChange}
      onEdit={handleEditTask}
      onDelete={handleDeleteTask}
      onFilter={handleFilter}
     onNewTask={() => {
  if (onNewTask) onNewTask();
  fetchTasks(); // 🔥 THIS FIXES YOUR ISSUE
}}
    />
  );
};

export default Tasks;