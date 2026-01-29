'use client';

import { useEffect, useState } from 'react';
import { useReminders } from '@/hooks/useReminders';
import { Reminder } from '@/types';

export function ReminderNotification() {
  const { activeReminders, dismissReminder } = useReminders();
  const [visibleReminders, setVisibleReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    if (activeReminders.length > 0) {
      setVisibleReminders(activeReminders.slice(0, 3));
    }
  }, [activeReminders]);

  const handleDismiss = async (id: string) => {
    await dismissReminder(id);
    setVisibleReminders((prev) => prev.filter((r) => r.id !== id));
  };

  if (visibleReminders.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleReminders.map((reminder) => (
        <div
          key={reminder.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 animate-slide-in"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Reminder
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {reminder.message}
              </p>
            </div>

            <button
              onClick={() => handleDismiss(reminder.id)}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
