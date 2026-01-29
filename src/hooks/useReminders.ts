'use client';

import { useMemo, useEffect, useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Reminder } from '@/types';

export function useReminders(projectId?: string) {
  const { state, addReminder, updateReminder, deleteReminder } = useApp();
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);

  const reminders = useMemo(() => {
    if (projectId) {
      return state.reminders.filter((r) => r.projectId === projectId);
    }
    return state.reminders;
  }, [state.reminders, projectId]);

  const unreadReminders = useMemo(() => {
    return reminders.filter((r) => !r.isRead);
  }, [reminders]);

  const checkDueReminders = useCallback(() => {
    const now = new Date();
    const dueReminders = state.reminders.filter((r) => {
      if (r.isRead) return false;
      const triggerDate = new Date(r.triggerDate);
      return triggerDate <= now;
    });

    setActiveReminders(dueReminders);
  }, [state.reminders]);

  useEffect(() => {
    checkDueReminders();

    const interval = setInterval(checkDueReminders, 60000);

    return () => clearInterval(interval);
  }, [checkDueReminders]);

  const getReminder = (id: string): Reminder | undefined => {
    return reminders.find((r) => r.id === id);
  };

  const createReminder = async (data: Omit<Reminder, 'id' | 'createdAt'>) => {
    return addReminder(data);
  };

  const markAsRead = async (id: string) => {
    await updateReminder(id, { isRead: true });
    setActiveReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const dismissReminder = async (id: string) => {
    await markAsRead(id);
  };

  return {
    reminders,
    unreadReminders,
    activeReminders,
    isLoading: state.isLoading,
    getReminder,
    createReminder,
    updateReminder,
    deleteReminder,
    markAsRead,
    dismissReminder,
  };
}
