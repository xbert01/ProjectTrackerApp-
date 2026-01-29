'use client';

import { Project } from '@/types';

interface TaskFiltersProps {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectChange: (projectId: string | null) => void;
  selectedStatus: 'all' | 'todo' | 'done';
  onStatusChange: (status: 'all' | 'todo' | 'done') => void;
}

export function TaskFilters({
  projects,
  selectedProjectId,
  onProjectChange,
  selectedStatus,
  onStatusChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Project
        </label>
        <select
          value={selectedProjectId || ''}
          onChange={(e) => onProjectChange(e.target.value || null)}
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.clientName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status
        </label>
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          {(['all', 'todo', 'done'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`
                px-4 py-2 text-sm font-medium capitalize transition-colors
                ${selectedStatus === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
