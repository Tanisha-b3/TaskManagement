// frontend/src/components/Tasks/TaskForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.jsx';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { createTask, updateTask, getTaskById } from "../services/api.js"
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  status: z.enum(['pending', 'in-progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional().nullable(),
});

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: null,
    },
  });

  const dueDate = watch('dueDate');

  useEffect(() => {
    if (isEditing) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const task = await getTaskById(id);
      setValue('title', task.title);
      setValue('description', task.description || '');
      setValue('status', task.status);
      setValue('priority', task.priority);
      setValue('dueDate', task.dueDate ? new Date(task.dueDate) : null);
    } catch (error) {
      toast.error('Failed to load task');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateTask(id, data);
        toast.success('Task updated successfully');
      } else {
        await createTask(data);
        toast.success('Task created successfully');
      }
      navigate('/tasks');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditing ? 'Update your task details' : 'Add a new task to your list'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              rows={4}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => setValue('status', value)}
                defaultValue="pending"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                onValueChange={(value) => setValue('priority', value)}
                defaultValue="medium"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => setValue('dueDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {dueDate && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setValue('dueDate', null)}
              >
                <X className="h-4 w-4 mr-1" />
                Clear date
              </Button>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/tasks')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;