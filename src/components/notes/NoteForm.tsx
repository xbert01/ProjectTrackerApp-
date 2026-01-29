'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface NoteFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
  initialContent?: string;
}

export function NoteForm({ onSubmit, onCancel, initialContent = '' }: NoteFormProps) {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Note content is required');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(content.trim());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        label="Note"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setError('');
        }}
        error={error}
        placeholder="Enter your note..."
        rows={5}
        autoFocus
      />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Save Note
        </Button>
      </div>
    </form>
  );
}
