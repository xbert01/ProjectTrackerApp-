'use client';

import { Task } from '@/types';
import { formatDate } from '@/lib/utils/date';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  canEdit?: boolean;
  showProject?: boolean;
  projectName?: string;
}

export function TaskItem({
  task,
  onToggle,
  onDelete,
  canEdit = true,
  showProject = false,
  projectName,
}: TaskItemProps) {
  return (
    <div
      className={`
        flex items-center gap-3 p-3 bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700 rounded-lg
        hover:border-gray-300 dark:hover:border-gray-600 transition-colors
      `}
    >
      <button
        onClick={() => onToggle(task.id)}
        disabled={!canEdit}
        className={`
          flex-shrink-0 w-5 h-5 rounded border-2 transition-colors
          ${task.status === 'done'
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
          }
          ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        {task.status === 'done' && (
          <svg className="w-full h-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`
            text-sm font-medium truncate
            ${task.status === 'done'
              ? 'line-through text-gray-400 dark:text-gray-500'
              : 'text-gray-900 dark:text-white'
            }
          `}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(task.calendarDate)}
          </span>
          {showProject && projectName && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              &bull; {projectName}
            </span>
          )}
        </div>
      </div>

      {canEdit && (
        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
}
