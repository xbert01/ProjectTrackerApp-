'use client';

import { Task } from '@/types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  canEdit?: boolean;
  showProject?: boolean;
  getProjectName?: (projectId: string) => string | undefined;
}

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  canEdit = true,
  showProject = false,
  getProjectName,
}: TaskListProps) {
  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <p className="mt-2 text-gray-500 dark:text-gray-400">No tasks yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {todoTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            To Do ({todoTasks.length})
          </h3>
          <div className="space-y-2">
            {todoTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                canEdit={canEdit}
                showProject={showProject}
                projectName={getProjectName?.(task.projectId)}
              />
            ))}
          </div>
        </div>
      )}

      {doneTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Done ({doneTasks.length})
          </h3>
          <div className="space-y-2">
            {doneTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                canEdit={canEdit}
                showProject={showProject}
                projectName={getProjectName?.(task.projectId)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
