'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useReminders } from '@/hooks/useReminders';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ReminderItem } from '@/components/reminders/ReminderItem';
import { ReminderForm } from '@/components/reminders/ReminderForm';
import { Theme } from '@/types';

export default function SettingsPage() {
  const { user, isManager } = useAuth();
  const { theme, setTheme } = useTheme();
  const { reminders, markAsRead, deleteReminder, createReminder } = useReminders();
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const themes: { label: string; value: Theme; icon: JSX.Element }[] = [
    {
      label: 'Light',
      value: 'light',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: 'Dark',
      value: 'dark',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
    },
    {
      label: 'System',
      value: 'system',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const handleCreateReminder = async (data: Parameters<typeof createReminder>[0]) => {
    await createReminder(data);
    setIsReminderModalOpen(false);
  };

  const getProject = (projectId?: string) => {
    return projectId ? projects.find((p) => p.id === projectId) : undefined;
  };

  const getTask = (taskId?: string) => {
    return taskId ? tasks.find((t) => t.id === taskId) : undefined;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      {/* Profile */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-medium">
              {user?.name?.charAt(0) || '?'}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              {isManager && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full">
                  Manager
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors
                  ${theme === t.value
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <span className={theme === t.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}>
                  {t.icon}
                </span>
                <span className={`text-sm font-medium ${theme === t.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reminders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reminders</h2>
          <Button size="sm" onClick={() => setIsReminderModalOpen(true)}>
            Add Reminder
          </Button>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="mt-2 text-gray-500 dark:text-gray-400">No reminders</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  project={getProject(reminder.projectId)}
                  task={getTask(reminder.taskId)}
                  onMarkRead={markAsRead}
                  onDelete={deleteReminder}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder Modal */}
      <Modal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        title="Add Reminder"
        size="lg"
      >
        <ReminderForm
          projects={projects}
          tasks={tasks}
          onSubmit={handleCreateReminder}
          onCancel={() => setIsReminderModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
