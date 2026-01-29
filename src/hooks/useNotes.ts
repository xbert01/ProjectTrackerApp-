'use client';

import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Note } from '@/types';

export function useNotes(projectId?: string) {
  const { state, addNote, updateNote, deleteNote } = useApp();

  const notes = useMemo(() => {
    if (projectId) {
      return state.notes
        .filter((n) => n.projectId === projectId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    return state.notes.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [state.notes, projectId]);

  const getNote = (id: string): Note | undefined => {
    return notes.find((n) => n.id === id);
  };

  const createNote = async (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    return addNote(data);
  };

  return {
    notes,
    isLoading: state.isLoading,
    getNote,
    createNote,
    updateNote,
    deleteNote,
  };
}
