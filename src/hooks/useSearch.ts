'use client';

import { useMemo, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { useProjects } from './useProjects';
import { createSearchIndex, search as performSearch, filterByType } from '@/lib/utils/search';
import { SearchResult } from '@/types';

export function useSearch() {
  const { state } = useApp();
  const { projects } = useProjects();

  const tasks = useMemo(() => {
    const projectIds = new Set(projects.map((p) => p.id));
    // Include tasks from user's projects and general tasks (no projectId)
    return state.tasks.filter((t) => !t.projectId || projectIds.has(t.projectId));
  }, [state.tasks, projects]);

  const notes = useMemo(() => {
    const projectIds = new Set(projects.map((p) => p.id));
    return state.notes.filter((n) => projectIds.has(n.projectId));
  }, [state.notes, projects]);

  const searchIndex = useMemo(() => {
    return createSearchIndex(projects, tasks, notes);
  }, [projects, tasks, notes]);

  const search = useCallback(
    (query: string, limit = 10): SearchResult[] => {
      return performSearch(searchIndex, query, limit);
    },
    [searchIndex]
  );

  const searchProjects = useCallback(
    (query: string, limit = 10): SearchResult[] => {
      const results = performSearch(searchIndex, query, limit * 2);
      return filterByType(results, 'project').slice(0, limit);
    },
    [searchIndex]
  );

  const searchTasks = useCallback(
    (query: string, limit = 10): SearchResult[] => {
      const results = performSearch(searchIndex, query, limit * 2);
      return filterByType(results, 'task').slice(0, limit);
    },
    [searchIndex]
  );

  const searchNotes = useCallback(
    (query: string, limit = 10): SearchResult[] => {
      const results = performSearch(searchIndex, query, limit * 2);
      return filterByType(results, 'note').slice(0, limit);
    },
    [searchIndex]
  );

  return {
    search,
    searchProjects,
    searchTasks,
    searchNotes,
  };
}
