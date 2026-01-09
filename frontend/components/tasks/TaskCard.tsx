'use client';

import type { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (status: Task['status']) => void;
  onComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const priorityColors = {
  low: 'bg-gray-500/10 text-gray-400',
  medium: 'bg-yellow-500/10 text-yellow-500',
  high: 'bg-red-500/10 text-red-500',
};

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export function TaskCard({
  task,
  onStatusChange,
  onComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const isCompleted = task.status === 'completed';

  return (
    <div
      className={`rounded-lg border border-[#3A3A3A] bg-[#2A2A2A] p-4 transition-all hover:border-[#FFA500]/50 ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3
            className={`font-medium ${
              isCompleted ? 'line-through text-[#A1A1A1]' : 'text-[#FAFAFA]'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-sm text-[#A1A1A1] line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="ml-4 flex items-center space-x-1">
          {!isCompleted && onComplete && (
            <button
              onClick={onComplete}
              className="rounded-lg px-2 py-1 text-lg transition-all hover:bg-green-500/20 hover:scale-110"
              title="Complete task"
            >
              ✅
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-lg px-2 py-1 text-lg transition-all hover:bg-blue-500/20 hover:scale-110"
              title="Edit task"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-lg px-2 py-1 text-lg transition-all hover:bg-red-500/20 hover:scale-110"
              title="Delete task"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status */}
        <span
          className={`rounded-full border px-2 py-0.5 text-xs ${statusColors[task.status]}`}
        >
          {statusLabels[task.status]}
        </span>

        {/* Priority */}
        <span className={`rounded-full px-2 py-0.5 text-xs ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>

        {/* Due date */}
        {task.dueDate && (
          <span className="text-xs text-[#A1A1A1]">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-[#FFA500]/10 px-2 py-0.5 text-xs text-[#FFA500]"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-[#A1A1A1]">+{task.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Recurring indicator */}
        {task.isRecurring && (
          <span className="text-xs text-[#A1A1A1]">
            🔁 {task.recurrencePattern}
          </span>
        )}
      </div>
    </div>
  );
}
