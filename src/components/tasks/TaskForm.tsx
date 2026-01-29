'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDateForInput } from '@/lib/utils/date';

interface TaskFormProps {
  onSubmit: (data: { title: string; calendarDate: string }) => Promise<void>;
  onCancel: () => void;
  defaultDate?: string;
}

export function TaskForm({ onSubmit, onCancel, defaultDate }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [calendarDate, setCalendarDate] = useState(
    defaultDate || formatDateForInput(new Date())
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({ title: title.trim(), calendarDate });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setError('');
        }}
        error={error}
        placeholder="Enter task title"
        autoFocus
      />

      <Input
        label="Date"
        type="date"
        value={calendarDate}
        onChange={(e) => setCalendarDate(e.target.value)}
      />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Add Task
        </Button>
      </div>
    </form>
  );
}
