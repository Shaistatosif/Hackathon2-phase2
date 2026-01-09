'use client';

import { useState } from 'react';
import type { Task, TaskCreateRequest, TaskPriority, RecurrencePattern } from '@/types';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskCreateRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
  );
  const [tags, setTags] = useState(task?.tags.join(', ') || '');
  const [isRecurring, setIsRecurring] = useState(task?.isRecurring || false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern | ''>(
    task?.recurrencePattern || ''
  );
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const data: TaskCreateRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isRecurring,
      recurrencePattern: isRecurring ? (recurrencePattern as RecurrencePattern) : undefined,
    };

    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-[#A1A1A1]">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-[#3A3A3A] bg-[#1C1C1C] px-4 py-2 text-[#FAFAFA] placeholder-[#6B7280] focus:border-[#FFA500] focus:outline-none focus:ring-1 focus:ring-[#FFA500]"
          placeholder="What needs to be done?"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-[#A1A1A1]">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-[#3A3A3A] bg-[#1C1C1C] px-4 py-2 text-[#FAFAFA] placeholder-[#6B7280] focus:border-[#FFA500] focus:outline-none focus:ring-1 focus:ring-[#FFA500]"
          placeholder="Add more details..."
        />
      </div>

      {/* Priority & Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="mb-2 block text-sm font-medium text-[#A1A1A1]">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full rounded-lg border border-[#3A3A3A] bg-[#1C1C1C] px-4 py-2 text-[#FAFAFA] focus:border-[#FFA500] focus:outline-none focus:ring-1 focus:ring-[#FFA500]"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="mb-2 block text-sm font-medium text-[#A1A1A1]">
            Due Date
          </label>
          <input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-[#3A3A3A] bg-[#1C1C1C] px-4 py-2 text-[#FAFAFA] focus:border-[#FFA500] focus:outline-none focus:ring-1 focus:ring-[#FFA500]"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="mb-2 block text-sm font-medium text-[#A1A1A1]">
          Tags
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full rounded-lg border border-[#3A3A3A] bg-[#1C1C1C] px-4 py-2 text-[#FAFAFA] placeholder-[#6B7280] focus:border-[#FFA500] focus:outline-none focus:ring-1 focus:ring-[#FFA500]"
          placeholder="work, urgent, personal (comma separated)"
        />
      </div>

      {/* Recurring */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="h-4 w-4 rounded border-[#3A3A3A] bg-[#1C1C1C] text-[#FFA500] focus:ring-[#FFA500]"
          />
          <span className="text-sm text-[#A1A1A1]">Recurring task</span>
        </label>

        {isRecurring && (
          <select
            value={recurrencePattern}
            onChange={(e) => setRecurrencePattern(e.target.value as RecurrencePattern)}
            className="rounded-lg border border-[#3A3A3A] bg-[#1C1C1C] px-3 py-1 text-sm text-[#FAFAFA] focus:border-[#FFA500] focus:outline-none"
          >
            <option value="">Select pattern</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#3A3A3A] px-4 py-2 text-sm font-medium text-[#A1A1A1] transition-colors hover:bg-[#3A3A3A] hover:text-[#FAFAFA]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-[#FFA500] px-4 py-2 text-sm font-medium text-[#1C1C1C] transition-colors hover:bg-[#FF8C00] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
