'use client';

import Link from 'next/link';
import { Project } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/date';
import { useTasks } from '@/hooks/useTasks';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { tasks } = useTasks(project.id);

  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const totalCount = tasks.length;

  return (
    <Link href={`/projects/${project.id}`}>
      <Card hover className="h-full">
        <CardContent>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {project.clientName}
            </h3>
            <StatusBadge status={project.status} />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
            {project.description || 'No description'}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
              {totalCount > 0 ? (
                <>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {doneCount}/{totalCount}
                  </span>
                </>
              ) : (
                <span>No tasks</span>
              )}
            </div>

            {project.endDate && (
              <span className="text-gray-500 dark:text-gray-400">
                Due: {formatDate(project.endDate)}
              </span>
            )}
          </div>

          {totalCount > 0 && (
            <div className="mt-3">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${(doneCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
