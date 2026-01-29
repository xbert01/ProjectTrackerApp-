'use client';

import { Task, Project } from '@/types';
import { formatDate } from '@/lib/utils/date';

interface OverdueTasksProps {
  tasks: Task[];
  projects: Project[];
  onToggle: (id: string) => void;
  onMoveToToday: (id: string) => void;
}

export function OverdueTasks({ tasks, projects, onToggle, onMoveToToday }: OverdueTasksProps) {
  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.clientName || 'Unknown Project';
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="mt-2 text-gray-500 dark:text-gray-400">No overdue tasks</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full" />
        <span className="text-sm font-medium text-red-600 dark:text-red-400">
          {tasks.length} overdue task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <button
            onClick={() => onToggle(task.id)}
            className="flex-shrink-0 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors"
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {task.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-red-600 dark:text-red-400">
                Due: {formatDate(task.calendarDate)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                &bull; {getProjectName(task.projectId)}
              </span>
            </div>
          </div>

          <button
            onClick={() => onMoveToToday(task.id)}
            className="flex-shrink-0 px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded transition-colors"
          >
            Move to Today
          </button>
        </div>
      ))}
    </div>
  );
}
