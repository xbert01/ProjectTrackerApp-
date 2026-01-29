'use client';

import { useState, useMemo, useCallback } from 'react';
import { CalendarView, Task } from '@/types';
import { useTasks } from './useTasks';
import { getWeekDates, getMonthDates, addDays, addMonths, formatDateForInput, isPast } from '@/lib/utils/date';

export function useCalendar() {
  const [view, setView] = useState<CalendarView>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasks, moveTaskToDate } = useTasks();

  const dates = useMemo(() => {
    switch (view) {
      case 'day':
        return [currentDate];
      case 'week':
        return getWeekDates(currentDate);
      case 'month':
        return getMonthDates(currentDate);
      default:
        return [currentDate];
    }
  }, [view, currentDate]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();

    dates.forEach((date) => {
      const dateStr = formatDateForInput(date);
      map.set(dateStr, []);
    });

    tasks.forEach((task) => {
      const existing = map.get(task.calendarDate);
      if (existing) {
        existing.push(task);
      }
    });

    return map;
  }, [tasks, dates]);

  const overdueTasks = useMemo(() => {
    const today = formatDateForInput(new Date());
    return tasks.filter((t) => t.status === 'todo' && t.calendarDate < today);
  }, [tasks]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToPrevious = useCallback(() => {
    switch (view) {
      case 'day':
        setCurrentDate((prev) => addDays(prev, -1));
        break;
      case 'week':
        setCurrentDate((prev) => addDays(prev, -7));
        break;
      case 'month':
        setCurrentDate((prev) => addMonths(prev, -1));
        break;
    }
  }, [view]);

  const goToNext = useCallback(() => {
    switch (view) {
      case 'day':
        setCurrentDate((prev) => addDays(prev, 1));
        break;
      case 'week':
        setCurrentDate((prev) => addDays(prev, 7));
        break;
      case 'month':
        setCurrentDate((prev) => addMonths(prev, 1));
        break;
    }
  }, [view]);

  const moveTask = useCallback(
    async (taskId: string, newDate: string) => {
      await moveTaskToDate(taskId, newDate);
    },
    [moveTaskToDate]
  );

  return {
    view,
    setView,
    currentDate,
    setCurrentDate,
    dates,
    tasksByDate,
    overdueTasks,
    goToToday,
    goToPrevious,
    goToNext,
    moveTask,
  };
}
