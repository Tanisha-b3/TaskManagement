// frontend/src/components/Tasks/TaskList.jsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import TaskCard from './TaskCard';
import { Card, CardContent } from '@/components/ui/card';

const TaskList = ({ tasks, onStatusChange, onEdit, onDelete, onFilter, onNewTask, compact }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const handleSearch = (value) => {
    setSearchTerm(value);
    onFilter({ search: value, status: statusFilter, priority: priorityFilter });
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    onFilter({ search: searchTerm, status: value, priority: priorityFilter });
  };

  const handlePriorityFilter = (value) => {
    setPriorityFilter(value);
    onFilter({ search: searchTerm, status: statusFilter, priority: value });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    onFilter({ search: '', status: 'all', priority: 'all' });
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="space-y-6 p-4">
      {/* Header with New Task button */}
      {!compact && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Tasks</h1>
            <p className="text-muted-foreground mt-1">Manage and organize all your tasks</p>
          </div>
          {onNewTask && (
            <Button onClick={onNewTask}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={handlePriorityFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchTerm}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleSearch('')} />
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleStatusFilter('all')} />
            </Badge>
          )}
          {priorityFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Priority: {priorityFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handlePriorityFilter('all')} />
            </Badge>
          )}
        </div>
      )}

      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm text-muted-foreground mt-2 mb-4">Create a new task to get started</p>
            {onNewTask && (
              <Button onClick={onNewTask}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;