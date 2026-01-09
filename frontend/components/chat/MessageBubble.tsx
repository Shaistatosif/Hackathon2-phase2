'use client';

import { cn } from '@/lib/utils';
import type { Message, TaskActionResponse } from '@/types';

interface MessageBubbleProps {
  message: Message;
  taskAction?: TaskActionResponse;
}

export function MessageBubble({ message, taskAction }: MessageBubbleProps) {
  const isUser = message.senderType === 'user';

  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-orange-500 text-white'
            : 'bg-[#2A2A2A] text-gray-100'
        )}
      >
        {/* Message content */}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

        {/* Task action indicator */}
        {taskAction && !isUser && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <TaskActionBadge action={taskAction} />
          </div>
        )}

        {/* Timestamp */}
        <p
          className={cn(
            'text-xs mt-2',
            isUser ? 'text-orange-100' : 'text-gray-400'
          )}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

function TaskActionBadge({ action }: { action: TaskActionResponse }) {
  const actionColors: Record<string, string> = {
    created: 'bg-green-600',
    updated: 'bg-blue-600',
    completed: 'bg-purple-600',
    deleted: 'bg-red-600',
    listed: 'bg-gray-600',
  };

  const actionLabels: Record<string, string> = {
    created: 'Task Created',
    updated: 'Task Updated',
    completed: 'Task Completed',
    deleted: 'Task Deleted',
    listed: 'Tasks Listed',
  };

  return (
    <div className="space-y-2">
      <span
        className={cn(
          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white',
          actionColors[action.action] || 'bg-gray-600'
        )}
      >
        {actionLabels[action.action] || action.action}
      </span>

      {/* Show task details for single task actions */}
      {action.task && (
        <div className="bg-[#1C1C1C] rounded-lg p-2 text-sm">
          <p className="font-medium text-white">{action.task.title}</p>
          <p className="text-gray-400 text-xs">
            {action.task.priority} priority | {action.task.status}
          </p>
        </div>
      )}

      {/* Show tasks list for list action */}
      {action.tasks && action.tasks.length > 0 && (
        <div className="space-y-1">
          {action.tasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="bg-[#1C1C1C] rounded-lg p-2 text-sm"
            >
              <p className="font-medium text-white">{task.title}</p>
              <p className="text-gray-400 text-xs">
                {task.priority} | {task.status}
              </p>
            </div>
          ))}
          {action.tasks.length > 5 && (
            <p className="text-gray-400 text-xs">
              +{action.tasks.length - 5} more tasks
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
