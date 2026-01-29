'use client';

import { useDroppable } from '@dnd-kit/core';
import { Task, Project } from '@/types';
import { TaskDraggable } from './TaskDraggable';
import { getDayName, isToday, formatDateForInput } from '@/lib/utils/date';

interface DayColumnProps {
  date: Date;
  tasks: Task[];
  projects: Project[];
  onToggleTask: (id: string) => void;
  onAddTask?: (date: string) => void;
}

function DayColumn({ date, tasks, projects, onToggleTask, onAddTask }: DayColumnProps) {
  const dateStr = formatDateForInput(date);
  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
  });

  const dayTasks = tasks.filter((t) => t.calendarDate === dateStr);

  const getProject = (projectId: string) => {
    return projects.find((p) => p.id === projectId);
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-1 min-w-0 p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0
        ${isOver ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
        ${isToday(date) ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}
        transition-colors
      `}
    >
      <div className="text-center mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {getDayName(date, true)}
        </div>
        <div
          className={`
            text-lg font-semibold
            ${isToday(date)
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-900 dark:text-white'
            }
          `}
        >
          {date.getDate()}
        </div>
        {onAddTask && (
          <button
            onClick={() => onAddTask(dateStr)}
            className="mt-1 p-0.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Add task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-1 min-h-[200px]">
        {dayTasks.map((task) => (
          <TaskDraggable
            key={task.id}
            task={task}
            project={getProject(task.projectId)}
            onToggle={onToggleTask}
          />
        ))}
      </div>
    </div>
  );
}

interface WeekViewProps {
  dates: Date[];
  tasks: Task[];
  projects: Project[];
  onToggleTask: (id: string) => void;
  onAddTask?: (date: string) => void;
}

export function WeekView({ dates, tasks, projects, onToggleTask, onAddTask }: WeekViewProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex">
        {dates.map((date) => (
          <DayColumn
            key={date.toISOString()}
            date={date}
            tasks={tasks}
            projects={projects}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
          />
        ))}
      </div>
    </div>
  );
}
