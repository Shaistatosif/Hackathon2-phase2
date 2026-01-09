'use client';

import type { Task } from '@/types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskList({
  tasks,
  isLoading,
  onComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg bg-[#2A2A2A]"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-[#3A3A3A] bg-[#2A2A2A] py-12">
        <div className="mb-4 text-6xl">📝</div>
        <h3 className="mb-2 text-lg font-medium">No tasks yet</h3>
        <p className="text-sm text-[#A1A1A1]">
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete ? () => onComplete(task.id) : undefined}
          onEdit={onEdit ? () => onEdit(task) : undefined}
          onDelete={onDelete ? () => onDelete(task.id) : undefined}
        />
      ))}
    </div>
  );
}
