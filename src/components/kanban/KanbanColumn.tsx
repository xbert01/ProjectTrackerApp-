'use client';

import { useDroppable } from '@dnd-kit/core';
import { Task, Project, TaskStatus } from '@/types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  projects: Project[];
  onDeleteTask?: (id: string) => void;
}

export function KanbanColumn({ id, title, tasks, projects, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { status: id },
  });

  const getProject = (projectId: string) => {
    return projects.find((p) => p.id === projectId);
  };

  const columnColors = {
    todo: 'border-t-gray-400',
    in_progress: 'border-t-yellow-500',
    done: 'border-t-green-500',
  };

  const columnBgColors = {
    todo: 'bg-gray-50 dark:bg-gray-800/50',
    in_progress: 'bg-yellow-50 dark:bg-yellow-900/10',
    done: 'bg-green-50 dark:bg-green-900/10',
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col min-h-[500px] rounded-lg border-t-4
        ${columnColors[id]}
        ${isOver ? 'bg-primary-50 dark:bg-primary-900/20' : columnBgColors[id]}
        transition-colors
      `}
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            project={getProject(task.projectId)}
            onDelete={onDeleteTask}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 text-sm text-gray-400 dark:text-gray-500">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
