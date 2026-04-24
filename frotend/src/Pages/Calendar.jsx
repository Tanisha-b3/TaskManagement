// frontend/src/pages/Calendar.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTasks } from '../services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Loader from '@/components/Loader'; // Fixed import path
import { toast } from 'react-hot-toast';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks({ limit: 100 }); // Get more tasks for calendar
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get starting day of week (0 = Sunday, 1 = Monday, etc.)
  const startDay = monthStart.getDay();
  
  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      try {
        const taskDate = new Date(task.dueDate);
        return isSameDay(taskDate, date);
      } catch (error) {
        return false;
      }
    });
  };

  // Get priority color for visual indicators
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Get status color for task items
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in-progress': return 'text-blue-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">View your tasks by due date</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="min-w-[80px]"
          >
            Today
          </Button>
          <span className="text-lg font-medium min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm">High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm">Medium Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm">Low Priority</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month start */}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square bg-muted/20 rounded-lg" />
            ))}
            
            {/* Days of the month */}
            {days.map(day => {
              const dayTasks = getTasksForDate(day);
              const hasHighPriority = dayTasks.some(t => t.priority === 'high');
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const hasTasks = dayTasks.length > 0;
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    aspect-square p-2 rounded-lg border-2 flex flex-col items-center justify-start
                    hover:bg-accent transition-all duration-200 relative
                    ${isToday ? 'border-primary bg-primary/5' : 'border-transparent'}
                    ${isSelected ? 'bg-accent border-primary' : ''}
                    ${hasTasks ? 'cursor-pointer' : 'cursor-pointer'}
                  `}
                >
                  <span className={`
                    text-sm font-medium
                    ${isToday ? 'text-primary' : ''}
                    ${hasHighPriority ? 'font-bold' : ''}
                  `}>
                    {format(day, 'd')}
                  </span>
                  
                  {/* Task indicators */}
                  {hasTasks && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {dayTasks.slice(0, 3).map((task, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}
                          title={`${task.title} (${task.priority} priority)`}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{dayTasks.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Tasks */}
      {selectedDate && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(selectedDate, 'MMMM d, yyyy')}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getTasksForDate(selectedDate).length} task(s) due on this day
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>
              Close
            </Button>
          </CardHeader>
          <CardContent>
            {getTasksForDate(selectedDate).length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No tasks due on this date</p>
                <Button variant="link" className="mt-2" onClick={() => window.location.href = '/tasks/new'}>
                  Create a new task
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {getTasksForDate(selectedDate).map(task => (
                  <div 
                    key={task._id || task.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/tasks/edit/${task._id}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{task.title}</p>
                        <Badge variant="outline" className={getStatusColor(task.status)}>
                          {task.status === 'in-progress' ? 'In Progress' : task.status}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/tasks/edit/${task._id}`}>View</a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Section */}
      {tasks.filter(t => t.dueDate).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasks
                .filter(task => task.dueDate && new Date(task.dueDate) >= new Date())
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 5)
                .map(task => (
                  <div key={task._id} className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                      <span className="font-medium">{task.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Calendar;