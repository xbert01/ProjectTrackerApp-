'use client';

import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { CalendarView, Task, Project } from '@/types';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { getMonthName, getDayName } from '@/lib/utils/date';

interface CalendarGridProps {
  view: CalendarView;
  currentDate: Date;
  dates: Date[];
  tasks: Task[];
  projects: Project[];
  onMoveTask: (taskId: string, newDate: string) => void;
  onToggleTask: (id: string) => void;
  onViewChange: (view: CalendarView) => void;
  onGoToToday: () => void;
  onGoToPrevious: () => void;
  onGoToNext: () => void;
  onAddTask?: (date: string) => void;
}

export function CalendarGrid({
  view,
  currentDate,
  dates,
  tasks,
  projects,
  onMoveTask,
  onToggleTask,
  onViewChange,
  onGoToToday,
  onGoToPrevious,
  onGoToNext,
  onAddTask,
}: CalendarGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newDate = over.id as string;
      onMoveTask(taskId, newDate);
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'day':
        return `${getDayName(currentDate)}, ${getMonthName(currentDate)} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
      case 'week':
        const startOfWeek = dates[0];
        const endOfWeek = dates[6];
        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${getMonthName(startOfWeek)} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
        }
        return `${getMonthName(startOfWeek, true)} ${startOfWeek.getDate()} - ${getMonthName(endOfWeek, true)} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
      case 'month':
        return `${getMonthName(currentDate)} ${currentDate.getFullYear()}`;
    }
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onGoToPrevious}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onGoToNext}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
            {getTitle()}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGoToToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Today
          </button>

          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {(['day', 'week', 'month'] as CalendarView[]).map((v) => (
              <button
                key={v}
                onClick={() => onViewChange(v)}
                className={`
                  px-3 py-1.5 text-sm font-medium capitalize transition-colors
                  ${view === v
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {view === 'day' && (
          <DayView
            date={currentDate}
            tasks={tasks}
            projects={projects}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
          />
        )}
        {view === 'week' && (
          <WeekView
            dates={dates}
            tasks={tasks}
            projects={projects}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
          />
        )}
        {view === 'month' && (
          <MonthView
            dates={dates}
            currentDate={currentDate}
            tasks={tasks}
            projects={projects}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
          />
        )}
      </DndContext>
    </div>
  );
}
