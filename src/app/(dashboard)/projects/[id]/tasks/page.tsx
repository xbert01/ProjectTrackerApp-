'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';

export default function ProjectTasksPage({ params }: { params: { id: string } }) {
  const { getProject } = useProjects();
  const { tasks, createTask, updateTask, deleteTask, toggleTaskStatus } = useTasks(params.id);
  const { canEditProject } = usePermissions();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const project = getProject(params.id);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Project not found
        </h2>
        <Link href="/projects" className="text-primary-600 hover:underline mt-2 inline-block">
          Back to projects
        </Link>
      </div>
    );
  }

  const canEdit = canEditProject(project);

  const handleCreateTask = async (data: { title: string; calendarDate: string }) => {
    await createTask({
      ...data,
      projectId: project.id,
      status: 'todo',
    });
    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${project.id}`}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
            <p className="text-gray-500 dark:text-gray-400">{project.clientName}</p>
          </div>
        </div>

        {canEdit && (
          <Button onClick={() => setIsFormOpen(true)}>Add Task</Button>
        )}
      </div>

      <TaskList
        tasks={tasks}
        onToggle={toggleTaskStatus}
        onDelete={deleteTask}
        canEdit={canEdit}
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add Task">
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
