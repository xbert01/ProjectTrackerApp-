'use client';

import { useDroppable } from '@dnd-kit/core';
import { Task, Project } from '@/types';
import { TaskDraggable } from './TaskDraggable';
import { isToday, formatDateForInput } from '@/lib/utils/date';

interface DayCellProps {
  date: Date;
  currentMonth: number;
  tasks: Task[];
  projects: Project[];
  onToggleTask: (id: string) => void;
  onAddTask?: (date: string) => void;
}

function DayCell({ date, currentMonth, tasks, projects, onToggleTask, onAddTask }: DayCellProps) {
  const dateStr = formatDateForInput(date);
  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
  });

  const dayTasks = tasks.filter((t) => t.calendarDate === dateStr);
  const isCurrentMonth = date.getMonth() === currentMonth;

  const getProject = (projectId: string) => {
    return projects.find((p) => p.id === projectId);
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[100px] p-1 border-b border-r border-gray-200 dark:border-gray-700
        ${isOver ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
        ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
        ${isToday(date) ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}
        transition-colors group
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`
            text-sm p-1
            ${!isCurrentMonth
              ? 'text-gray-400 dark:text-gray-600'
              : isToday(date)
              ? 'text-primary-600 dark:text-primary-400 font-semibold'
              : 'text-gray-700 dark:text-gray-300'
            }
          `}
        >
          {date.getDate()}
        </span>
        {onAddTask && (
          <button
            onClick={() => onAddTask(dateStr)}
            className="p-0.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-all"
            title="Add task"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-1 max-h-[80px] overflow-y-auto scrollbar-thin">
        {dayTasks.slice(0, 3).map((task) => (
          <TaskDraggable
            key={task.id}
            task={task}
            project={getProject(task.projectId)}
            onToggle={onToggleTask}
          />
        ))}
        {dayTasks.length > 3 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            +{dayTasks.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}

interface MonthViewProps {
  dates: Date[];
  currentDate: Date;
  tasks: Task[];
  projects: Project[];
  onToggleTask: (id: string) => void;
  onAddTask?: (date: string) => void;
}

export function MonthView({ dates, currentDate, tasks, projects, onToggleTask, onAddTask }: MonthViewProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {dates.map((date) => (
          <DayCell
            key={date.toISOString()}
            date={date}
            currentMonth={currentDate.getMonth()}
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
