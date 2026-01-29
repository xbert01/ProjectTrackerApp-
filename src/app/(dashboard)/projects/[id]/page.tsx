'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useNotes } from '@/hooks/useNotes';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { NoteList } from '@/components/notes/NoteList';
import { NoteForm } from '@/components/notes/NoteForm';
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/ui/Dropdown';
import { formatDate } from '@/lib/utils/date';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getProject, updateProject, deleteProject, completeProject, reactivateProject } = useProjects();
  const { tasks, createTask, updateTask, deleteTask, toggleTaskStatus } = useTasks(params.id);
  const { notes, createNote, updateNote, deleteNote } = useNotes(params.id);
  const { canEditProject, canDeleteProject, isOwner, isManager } = usePermissions();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes'>('tasks');

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
  const canDelete = canDeleteProject(project);

  const handleUpdate = async (data: Parameters<typeof updateProject>[1]) => {
    setIsLoading(true);
    try {
      await updateProject(project.id, data);
      setIsEditModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    await deleteProject(project.id);
    router.push('/projects');
  };

  const handleToggleComplete = async () => {
    if (project.status === 'completed') {
      await reactivateProject(project.id);
    } else {
      await completeProject(project.id);
    }
  };

  const handleCreateTask = async (data: { title: string; calendarDate: string }) => {
    await createTask({
      ...data,
      projectId: project.id,
      status: 'todo',
    });
    setIsTaskFormOpen(false);
  };

  const handleCreateNote = async (content: string) => {
    await createNote({
      projectId: project.id,
      content,
    });
    setIsNoteFormOpen(false);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/projects"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {project.clientName}
            </h1>
            <StatusBadge status={project.status} />
          </div>
          {project.description && (
            <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
          )}
        </div>

        {canEdit && (
          <Dropdown
            align="right"
            trigger={
              <Button variant="ghost" size="sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </Button>
            }
          >
            <DropdownItem onClick={() => setIsEditModalOpen(true)}>Edit Project</DropdownItem>
            <DropdownItem onClick={handleToggleComplete}>
              {project.status === 'completed' ? 'Reactivate' : 'Mark Complete'}
            </DropdownItem>
            {canDelete && (
              <>
                <DropdownDivider />
                <DropdownItem variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
                  Delete Project
                </DropdownItem>
              </>
            )}
          </Dropdown>
        )}
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="py-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">Created</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {formatDate(project.createdAt)}
            </div>
          </CardContent>
        </Card>

        {project.endDate && (
          <Card>
            <CardContent className="py-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">Due Date</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatDate(project.endDate)}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="py-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">Tasks</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {tasks.filter((t) => t.status === 'done').length} / {tasks.length} done
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Links */}
      {(project.links?.sow || project.links?.usabilityGuidelines || project.links?.githubRepository || project.links?.figma || project.links?.feedbackSpreadsheet) && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Links</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {project.links?.sow && (
                <a
                  href={project.links.sow}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  SOW
                </a>
              )}
              {project.links?.usabilityGuidelines && (
                <a
                  href={project.links.usabilityGuidelines}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Guidelines
                </a>
              )}
              {project.links?.githubRepository && (
                <a
                  href={project.links.githubRepository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
              {project.links?.figma && (
                <a
                  href={project.links.figma}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zM8.148 24c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v4.49c0 2.476-2.014 4.49-4.588 4.49zm-.001-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02 3.019-1.355 3.019-3.019v-3.02H8.147zM8.148 8.981c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981H8.148zm-.001-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V1.471H8.147zM8.148 15.02c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v4.49c0 2.476-2.014 4.49-4.588 4.49zm3.117-7.509H8.148c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019 3.019-1.355 3.019-3.019V7.511h.098zM15.852 15.02c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49 4.49 2.014 4.49 4.49-2.014 4.49-4.49 4.49zm0-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019 3.019-1.355 3.019-3.019-1.354-3.019-3.019-3.019z" />
                  </svg>
                  Figma
                </a>
              )}
              {project.links?.feedbackSpreadsheet && (
                <a
                  href={project.links.feedbackSpreadsheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Feedback
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tasks'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Notes ({notes.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'tasks' ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h2>
            {canEdit && (
              <Button size="sm" onClick={() => setIsTaskFormOpen(true)}>
                Add Task
              </Button>
            )}
          </div>
          <TaskList
            tasks={tasks}
            onToggle={toggleTaskStatus}
            onDelete={deleteTask}
            canEdit={canEdit}
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h2>
            {canEdit && (
              <Button size="sm" onClick={() => setIsNoteFormOpen(true)}>
                Add Note
              </Button>
            )}
          </div>
          <NoteList
            notes={notes}
            onUpdate={updateNote}
            onDelete={deleteNote}
            canEdit={canEdit}
          />
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project" size="lg">
        <ProjectForm
          project={project}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This will also delete all associated tasks and notes. This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* Task Form Modal */}
      <Modal isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} title="Add Task">
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsTaskFormOpen(false)}
        />
      </Modal>

      {/* Note Form Modal */}
      <Modal isOpen={isNoteFormOpen} onClose={() => setIsNoteFormOpen(false)} title="Add Note">
        <NoteForm
          onSubmit={handleCreateNote}
          onCancel={() => setIsNoteFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
