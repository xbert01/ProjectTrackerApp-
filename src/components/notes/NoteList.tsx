'use client';

import { Note } from '@/types';
import { NoteCard } from './NoteCard';

interface NoteListProps {
  notes: Note[];
  onUpdate: (id: string, updates: Partial<Note>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  canEdit?: boolean;
}

export function NoteList({ notes, onUpdate, onDelete, canEdit = true }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <p className="mt-2 text-gray-500 dark:text-gray-400">No notes yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onUpdate={onUpdate}
          onDelete={onDelete}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
}
