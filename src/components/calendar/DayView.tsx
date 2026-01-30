'use client';

import { useDroppable } from '@dnd-kit/core';
import { Task, Project } from '@/types';
import { TaskDraggable } from './TaskDraggable';
import { formatDate, isToday, formatDateForInput } from '@/lib/utils/date';

interface DayViewProps {
  date: Date;
  tasks: Task[];
  projects: Project[];
  onToggleTask: (id: string) => void;
  onAddTask?: (date: string) => void;
  onEditTask?: (task: Task) => void;
}

export function DayView({ date, tasks, projects, onToggleTask, onAddTask, onEditTask }: DayViewProps) {
  const dateStr = formatDateForInput(date);
  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
  });

  const dayTasks = tasks.filter((t) => t.calendarDate === dateStr);

  const getProject = (projectId?: string) => {
    return projectId ? projects.find((p) => p.id === projectId) : undefined;
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[300px] p-4 bg-white dark:bg-gray-800 rounded-lg
        border border-gray-200 dark:border-gray-700
        ${isOver ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300' : ''}
        transition-colors
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatDate(date)}
          </h2>
          {isToday(date) && (
            <span className="text-sm text-primary-600 dark:text-primary-400">Today</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
          </span>
          {onAddTask && (
            <button
              onClick={() => onAddTask(dateStr)}
              className="p-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
              title="Add task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {dayTasks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-24 text-sm text-gray-400 dark:text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            onClick={() => onAddTask?.(dateStr)}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Click to add a task
          </div>
        ) : (
          dayTasks.map((task) => (
            <TaskDraggable
              key={task.id}
              task={task}
              project={getProject(task.projectId)}
              onToggle={onToggleTask}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
