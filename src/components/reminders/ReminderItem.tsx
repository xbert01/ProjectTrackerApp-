'use client';

import { Reminder, Project, Task } from '@/types';
import { formatDateTime } from '@/lib/utils/date';

interface ReminderItemProps {
  reminder: Reminder;
  project?: Project;
  task?: Task;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ReminderItem({ reminder, project, task, onMarkRead, onDelete }: ReminderItemProps) {
  const isPast = new Date(reminder.triggerDate) <= new Date();

  return (
    <div
      className={`
        p-4 rounded-lg border transition-colors
        ${reminder.isRead
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
          : isPast
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p
            className={`
              font-medium
              ${reminder.isRead
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-gray-900 dark:text-white'
              }
            `}
          >
            {reminder.message}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span>{formatDateTime(reminder.triggerDate)}</span>
            {project && (
              <>
                <span>&bull;</span>
                <span>{project.clientName}</span>
              </>
            )}
            {task && (
              <>
                <span>&bull;</span>
                <span>Task: {task.title}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!reminder.isRead && (
            <button
              onClick={() => onMarkRead(reminder.id)}
              className="p-1 text-gray-400 hover:text-green-500 transition-colors"
              title="Mark as read"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onDelete(reminder.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
