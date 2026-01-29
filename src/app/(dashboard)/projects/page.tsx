'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProjects } from '@/hooks/useProjects';
import { ProjectList } from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/Button';

type FilterStatus = 'all' | 'active' | 'paused' | 'completed';

export default function ProjectsPage() {
  const { projects, activeProjects, pausedProjects, completedProjects, isLoading } = useProjects();
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filteredProjects = {
    all: projects,
    active: activeProjects,
    paused: pausedProjects,
    completed: completedProjects,
  }[filter];

  const filters: { label: string; value: FilterStatus; count: number }[] = [
    { label: 'All', value: 'all', count: projects.length },
    { label: 'Active', value: 'active', count: activeProjects.length },
    { label: 'Paused', value: 'paused', count: pausedProjects.length },
    { label: 'Completed', value: 'completed', count: completedProjects.length },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <Link href="/projects/new">
          <Button>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Project
          </Button>
        </Link>
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
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      <ProjectList
        projects={filteredProjects}
        emptyMessage={
          filter === 'all'
            ? "No projects yet. Create your first project!"
            : `No ${filter} projects`
        }
      />
    </div>
  );
}
