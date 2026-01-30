'use client';

import { useDraggable } from '@dnd-kit/core';
import { Task, Project } from '@/types';
import { formatDate, isPast, isToday } from '@/lib/utils/date';

interface KanbanCardProps {
  task: Task;
  project?: Project;
  onDelete?: (id: string) => void;
}

export function KanbanCard({ task, project, onDelete }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task, type: 'task' },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // Due date warning logic
  const isOverdue = task.status !== 'done' && isPast(task.calendarDate) && !isToday(task.calendarDate);
  const isApproaching = !isOverdue && task.status !== 'done' && (() => {
    const dueDate = new Date(task.calendarDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  })();

  // Generate a color based on project id for the ribbon
  const getProjectColor = (projectId?: string) => {
    if (!projectId) return 'bg-gray-400'; // General tasks

    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];
    let hash = 0;
    for (let i = 0; i < projectId.length; i++) {
      hash = projectId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border
        ${isOverdue
          ? 'border-red-300 dark:border-red-700'
          : isApproaching
          ? 'border-yellow-300 dark:border-yellow-700'
          : 'border-gray-200 dark:border-gray-700'
        }
        ${isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'}
        hover:shadow-md transition-shadow overflow-hidden
      `}
    >
      {/* Project color ribbon */}
      <div className={`absolute top-0 left-0 w-1 h-full ${getProjectColor(task.projectId)}`} />

      <div className="p-3 pl-4">
        <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {task.title}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {project ? (
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">
                {project.clientName}
              </span>
            ) : !task.projectId && (
              <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                General
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs ${
              isOverdue
                ? 'text-red-600 dark:text-red-400 font-medium'
                : isApproaching
                ? 'text-yellow-600 dark:text-yellow-400 font-medium'
                : 'text-gray-400 dark:text-gray-500'
            }`}>
              {formatDate(task.calendarDate)}
            </span>

            {isOverdue && (
              <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full" title="Overdue" />
            )}
            {isApproaching && !isOverdue && (
              <span className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full" title="Due soon" />
            )}
          </div>
        </div>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
