// frontend/src/components/Tasks/TaskCard.jsx
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  Calendar, 
  Edit2, 
  Trash2, 
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx';
import { cn } from '@/lib/utils';

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            {getStatusIcon(task.status)}
          </div>
          <div className="flex gap-2">
            <Badge variant={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge variant="outline">
              {task.status === 'in-progress' ? 'In Progress' : task.status}
            </Badge>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center gap-4">
          {task.dueDate && (
            <div className={cn("flex items-center gap-1 text-sm", isOverdue && "text-red-500")}>
              <Calendar className="h-4 w-4" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="text-sm border rounded-md px-2 py-1 bg-background"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;