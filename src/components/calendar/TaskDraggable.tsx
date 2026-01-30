'use client';

import { useDraggable } from '@dnd-kit/core';
import { Task, Project } from '@/types';
import { isPast, isToday } from '@/lib/utils/date';

interface TaskDraggableProps {
  task: Task;
  project?: Project;
  onToggle: (id: string) => void;
  onEdit?: (task: Task) => void;
}

// Generate a color based on project id for the ribbon
const getProjectColor = (projectId?: string) => {
  if (!projectId) return 'bg-gray-400';  // General tasks

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

export function TaskDraggable({ task, project, onToggle, onEdit }: TaskDraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative flex items-center gap-2 p-2 pl-3 text-xs rounded overflow-hidden group
        ${task.status === 'done'
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          : isOverdue
          ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          : isApproaching
          ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
          : 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
        }
        ${isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'}
        hover:shadow-sm transition-shadow
      `}
    >
      {/* Project color ribbon */}
      <div className={`absolute top-0 left-0 w-1 h-full ${getProjectColor(task.projectId)}`} />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        className={`
          flex-shrink-0 w-3.5 h-3.5 rounded border transition-colors
          ${task.status === 'done'
            ? 'bg-green-500 border-green-500 text-white'
            : task.status === 'in_progress'
            ? 'bg-yellow-500 border-yellow-500 text-white'
            : 'border-gray-300 dark:border-gray-500 hover:border-primary-500'
          }
        `}
      >
        {task.status === 'done' && (
          <svg className="w-full h-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {task.status === 'in_progress' && (
          <svg className="w-full h-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <span className={`truncate block ${task.status === 'done' ? 'line-through' : ''}`}>
          {task.title}
        </span>
        {project ? (
          <span className="text-[10px] opacity-60 truncate block">
            {project.clientName}
          </span>
        ) : !task.projectId && (
          <span className="text-[10px] opacity-60 truncate block italic">
            General
          </span>
        )}
      </div>

      {/* Edit button */}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="flex-shrink-0 p-0.5 opacity-0 group-hover:opacity-100 hover:text-primary-600 dark:hover:text-primary-400 transition-opacity"
          title="Edit task"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}

      {/* Due date warning indicator */}
      {(isOverdue || isApproaching) && (
        <span
          className={`flex-shrink-0 w-2 h-2 rounded-full ${
            isOverdue ? 'bg-red-500' : 'bg-yellow-500'
          }`}
          title={isOverdue ? 'Overdue' : 'Due soon'}
        />
      )}
    </div>
  );
}
