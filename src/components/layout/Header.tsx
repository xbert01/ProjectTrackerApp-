'use client';

import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { SearchInput } from '@/components/ui/SearchInput';
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/ui/Dropdown';
import { useSearch } from '@/hooks/useSearch';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, isManager } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { search } = useSearch();

  const themeIcon = resolvedTheme === 'dark' ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden sm:block w-64 lg:w-80">
          <SearchInput
            onSearch={search}
            placeholder="Search projects, tasks, notes..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Dropdown
          align="right"
          trigger={
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
              {themeIcon}
            </button>
          }
        >
          <DropdownItem onClick={() => setTheme('light')}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Light
              {theme === 'light' && <span className="ml-auto text-primary-600">&#10003;</span>}
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => setTheme('dark')}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Dark
              {theme === 'dark' && <span className="ml-auto text-primary-600">&#10003;</span>}
            </span>
          </DropdownItem>
          <DropdownItem onClick={() => setTheme('system')}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              System
              {theme === 'system' && <span className="ml-auto text-primary-600">&#10003;</span>}
            </span>
          </DropdownItem>
        </Dropdown>

        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || ''}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0) || '?'}
                </div>
              )}
            </button>
          }
        >
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
            {isManager && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full">
                Manager
              </span>
            )}
          </div>
          <DropdownItem onClick={() => window.location.href = '/login'}>Sign out</DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
