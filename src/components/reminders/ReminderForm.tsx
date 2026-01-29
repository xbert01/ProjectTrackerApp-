'use client';

import { useState } from 'react';
import { Project, Task } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

interface ReminderFormProps {
  projects: Project[];
  tasks: Task[];
  onSubmit: (data: {
    message: string;
    triggerDate: string;
    projectId?: string;
    taskId?: string;
    isRead: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  defaultProjectId?: string;
  defaultTaskId?: string;
}

export function ReminderForm({
  projects,
  tasks,
  onSubmit,
  onCancel,
  defaultProjectId,
  defaultTaskId,
}: ReminderFormProps) {
  const [message, setMessage] = useState('');
  const [triggerDate, setTriggerDate] = useState('');
  const [triggerTime, setTriggerTime] = useState('09:00');
  const [projectId, setProjectId] = useState(defaultProjectId || '');
  const [taskId, setTaskId] = useState(defaultTaskId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredTasks = projectId
    ? tasks.filter((t) => t.projectId === projectId)
    : tasks;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (!triggerDate) {
      newErrors.triggerDate = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      const dateTime = new Date(`${triggerDate}T${triggerTime}`);

      await onSubmit({
        message: message.trim(),
        triggerDate: dateTime.toISOString(),
        projectId: projectId || undefined,
        taskId: taskId || undefined,
        isRead: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        label="Reminder Message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setErrors((prev) => ({ ...prev, message: '' }));
        }}
        error={errors.message}
        placeholder="What do you want to be reminded about?"
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={triggerDate}
          onChange={(e) => {
            setTriggerDate(e.target.value);
            setErrors((prev) => ({ ...prev, triggerDate: '' }));
          }}
          error={errors.triggerDate}
        />

        <Input
          label="Time"
          type="time"
          value={triggerTime}
          onChange={(e) => setTriggerTime(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Project (Optional)
        </label>
        <select
          value={projectId}
          onChange={(e) => {
            setProjectId(e.target.value);
            setTaskId('');
          }}
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">No project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.clientName}
            </option>
          ))}
        </select>
      </div>

      {filteredTasks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Task (Optional)
          </label>
          <select
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">No task</option>
            {filteredTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Create Reminder
        </Button>
      </div>
    </form>
  );
}
