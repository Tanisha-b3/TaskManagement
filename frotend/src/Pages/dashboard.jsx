// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ListTodo, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { getTasks, getTaskStats, updateTaskStatus, deleteTask } from '../services/api';
import TaskList from '../Tasks/TaskList';
import Loader from '../components/Loader';

const Dashboard = ({ onEditTask }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [tasksData, statsData] = await Promise.all([
        getTasks({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' }),
        getTaskStats(),
      ]);
      setTasks(tasksData.tasks || []);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleEditTask = (task) => {
    if (onEditTask) {
      onEditTask(task._id);
    }
  };

  const handleFilter = async (filters) => {
    try {
      const filteredTasks = await getTasks(filters);
      setTasks(filteredTasks.tasks || []);
    } catch (error) {
      console.error('Filter error:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your task overview</p>
        </div>
        <Button onClick={() => navigate('/tasks')}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={<ListTodo className="h-4 w-4 text-white" />}
          color="bg-primary"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<Clock className="h-4 w-4 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<TrendingUp className="h-4 w-4 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle2 className="h-4 w-4 text-white" />}
          color="bg-green-500"
        />
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onFilter={handleFilter}
            compact
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;