'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearch } from '@/hooks/useSearch';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { SearchResult } from '@/types';

type FilterType = 'all' | 'project' | 'task' | 'note';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const { search, searchProjects, searchTasks, searchNotes } = useSearch();

  const results = useMemo(() => {
    if (!query.trim()) return [];

    switch (filter) {
      case 'project':
        return searchProjects(query, 50);
      case 'task':
        return searchTasks(query, 50);
      case 'note':
        return searchNotes(query, 50);
      default:
        return search(query, 50);
    }
  }, [query, filter, search, searchProjects, searchTasks, searchNotes]);

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Projects', value: 'project' },
    { label: 'Tasks', value: 'task' },
    { label: 'Notes', value: 'note' },
  ];

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case 'project':
        return `/projects/${result.id}`;
      case 'task':
        return `/projects/${result.projectId}`;
      case 'note':
        return `/projects/${result.projectId}/notes`;
    }
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return (
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
        );
      case 'task':
        return (
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        );
      case 'note':
        return (
          <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Search</h1>

      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tasks, and notes..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoFocus
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${filter === f.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {query.trim() === '' ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Start typing to search
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            No results found for &quot;{query}&quot;
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
          {results.map((result) => (
            <Link key={`${result.type}-${result.id}`} href={getResultLink(result)}>
              <Card hover>
                <CardContent className="py-3">
                  <div className="flex items-center gap-4">
                    {getTypeIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 capitalize px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {result.type}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
