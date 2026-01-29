'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskStatus } from '@/types';

export default function KanbanPage() {
  const { tasks, setTaskStatus, deleteTask, createTask } = useTasks();
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const handleMoveTask = async (taskId: string, newStatus: TaskStatus) => {
    await setTaskStatus(taskId, newStatus);
  };

  const handleCreateTask = async (data: { title: string; calendarDate: string }) => {
    if (!selectedProjectId && projects.length === 0) {
      alert('Please create a project first');
      return;
    }

    await createTask({
      ...data,
      projectId: selectedProjectId || projects[0].id,
      status: 'todo',
    });
    setIsTaskFormOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Drag and drop tasks between columns to update their status
          </p>
        </div>
        <Button onClick={() => setIsTaskFormOpen(true)}>Add Task</Button>
      </div>

      <KanbanBoard
        tasks={tasks}
        projects={projects}
        onMoveTask={handleMoveTask}
        onDeleteTask={deleteTask}
        selectedProjectId={selectedProjectId}
        onProjectFilterChange={setSelectedProjectId}
      />

      {/* Task Form Modal */}
      <Modal isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} title="Add Task">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project
          </label>
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value || null)}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.clientName}
              </option>
            ))}
          </select>
        </div>
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsTaskFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
