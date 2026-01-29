'use client';

import Link from 'next/link';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useReminders } from '@/hooks/useReminders';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { formatDate, formatDateForInput, isPast } from '@/lib/utils/date';

export default function DashboardPage() {
  const { user } = useAuth();
  const { activeProjects, projects, isLoading } = useProjects();
  const { tasks, toggleTaskStatus } = useTasks();
  const { unreadReminders } = useReminders();

  const todayStr = formatDateForInput(new Date());
  const todayTasks = tasks.filter((t) => t.calendarDate === todayStr);
  const overdueTasks = tasks.filter((t) => t.status === 'todo' && isPast(t.calendarDate) && t.calendarDate !== todayStr);

  const stats = [
    {
      label: 'Active Projects',
      value: activeProjects.length,
      href: '/projects',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Tasks Due Today',
      value: todayTasks.filter((t) => t.status === 'todo').length,
      href: '/calendar',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
      label: 'Overdue Tasks',
      value: overdueTasks.length,
      href: '/calendar',
      color: overdueTasks.length > 0
        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    },
    {
      label: 'Unread Reminders',
      value: unreadReminders.length,
      href: '/settings',
      color: unreadReminders.length > 0
        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    },
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <Link href="/projects/new">
          <Button>New Project</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card hover className="h-full">
              <CardContent className="py-4">
                <div className={`inline-flex p-2 rounded-lg mb-2 ${stat.color}`}>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Projects
            </h2>
            <Link
              href="/projects"
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  No active projects
                </p>
                <Link href="/projects/new" className="mt-4 inline-block">
                  <Button size="sm">Create your first project</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeProjects.slice(0, 4).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* Today's Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Today&apos;s Tasks
            </h2>
            <Link
              href="/calendar"
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View calendar
            </Link>
          </div>

          <Card>
            <CardContent className="p-0">
              {todayTasks.length === 0 ? (
                <div className="py-8 text-center">
                  <svg
                    className="mx-auto h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No tasks for today
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {todayTasks.slice(0, 5).map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    return (
                      <li key={task.id} className="p-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className={`
                              flex-shrink-0 w-5 h-5 rounded border-2 transition-colors
                              ${task.status === 'done'
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                              }
                            `}
                          >
                            {task.status === 'done' && (
                              <svg className="w-full h-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm truncate ${
                                task.status === 'done'
                                  ? 'line-through text-gray-400 dark:text-gray-500'
                                  : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              {task.title}
                            </p>
                            {project && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {project.clientName}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Overdue Tasks Warning */}
          {overdueTasks.length > 0 && (
            <div className="mt-4">
              <Link href="/calendar">
                <Card hover className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">
                          {overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-500">
                          Click to view in calendar
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
