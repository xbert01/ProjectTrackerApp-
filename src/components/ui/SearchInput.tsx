'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchResult } from '@/types';
import { useRouter } from 'next/navigation';

interface SearchInputProps {
  onSearch: (query: string) => SearchResult[];
  placeholder?: string;
  className?: string;
}

export function SearchInput({ onSearch, placeholder = 'Search...', className = '' }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      const searchResults = onSearch(value);
      setResults(searchResults);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);

    switch (result.type) {
      case 'project':
        router.push(`/projects/${result.id}`);
        break;
      case 'task':
        router.push(`/projects/${result.projectId}`);
        break;
      case 'note':
        router.push(`/projects/${result.projectId}/notes`);
        break;
    }
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        );
      case 'task':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'note':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-4 py-2
            bg-gray-100 dark:bg-gray-700
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            rounded-lg
            border border-transparent
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-800
            transition-colors
          "
        />
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="
            absolute z-50 w-full mt-2
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-lg shadow-lg
            max-h-64 overflow-y-auto
          "
        >
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleSelect(result)}
              className={`
                w-full px-4 py-2 flex items-center gap-3 text-left
                ${index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                transition-colors
              `}
            >
              <span className="text-gray-400">{getTypeIcon(result.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {result.title}
                </p>
                {result.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {result.subtitle}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-400 capitalize">{result.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
