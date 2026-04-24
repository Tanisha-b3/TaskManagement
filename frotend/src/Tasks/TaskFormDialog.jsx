import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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

const TaskFormDialog = ({ open, onOpenChange, taskId, onSuccess }) => {
  const navigate = useNavigate();
  const isEditing = !!taskId;
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
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
    if (open) {
      if (isEditing) {
        fetchTask();
      } else {
        reset({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          dueDate: null,
        });
      }
    }
  }, [open, taskId]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const task = await getTaskById(taskId);
      setValue('title', task.title || '');
      setValue('description', task.description || '');
      setValue('status', task.status || 'pending');
      setValue('priority', task.priority || 'medium');
      setValue('dueDate', task.dueDate ? new Date(task.dueDate) : null);
    } catch (error) {
      toast.error('Failed to load task');
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateTask(taskId, data);
        toast.success('Task updated successfully');
      } else {
        await createTask(data);
        toast.success('Task created successfully');
      }
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-title">Title *</Label>
              <Input
                id="dialog-title"
                placeholder="Enter task title"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dialog-description">Description</Label>
              <Textarea
                id="dialog-description"
                placeholder="Enter task description"
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) => setValue('status', value)}
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
                <Label>Priority</Label>
                <Select
                  value={watch('priority')}
                  onValueChange={(value) => setValue('priority', value)}
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
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-1"
                  onClick={() => setValue('dueDate', null)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear date
                </Button>
              )}
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;