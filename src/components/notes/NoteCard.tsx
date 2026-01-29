'use client';

import { useState } from 'react';
import { Note } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/lib/utils/date';

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  canEdit?: boolean;
}

export function NoteCard({ note, onUpdate, onDelete, canEdit = true }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      await onUpdate(note.id, { content: content.trim() });
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setContent(note.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(note.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} isLoading={isLoading}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {note.content}
            </p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Updated {formatDateTime(note.updatedAt)}
              </span>
              {canEdit && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
