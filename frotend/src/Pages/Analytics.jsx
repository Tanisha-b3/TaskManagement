// frontend/src/Pages/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTasks, getTaskStats } from '../services/api';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [priorityData, setPriorityData] = useState({ high: 0, medium: 0, low: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, tasksData] = await Promise.all([
        getTaskStats(),
        getTasks({ limit: 100 })
      ]);
      setStats(statsData);
      setTasks(tasksData.tasks || []);

      const priorityCounts = { high: 0, medium: 0, low: 0 };
      tasksData.tasks?.forEach(task => {
        if (task.priority in priorityCounts) {
          priorityCounts[task.priority]++;
        }
      });
      setPriorityData(priorityCounts);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const completionRate = stats?.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your productivity</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.inProgress || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completed || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pending</span>
                <span>{stats?.pending || 0} ({stats?.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%)</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500"
                  style={{ width: `${stats?.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>In Progress</span>
                <span>{stats?.inProgress || 0} ({stats?.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%)</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: `${stats?.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completed</span>
                <span>{stats?.completed || 0} ({stats?.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%)</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${stats?.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-red-500/10">
              <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{priorityData.high}</div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-500/10">
              <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{priorityData.medium}</div>
              <div className="text-sm text-muted-foreground">Medium Priority</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{priorityData.low}</div>
              <div className="text-sm text-muted-foreground">Low Priority</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;