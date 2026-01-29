'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Task, Project, TaskStatus } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface KanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  onMoveTask: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  selectedProjectId?: string | null;
  onProjectFilterChange?: (projectId: string | null) => void;
}

export function KanbanBoard({
  tasks,
  projects,
  onMoveTask,
  onDeleteTask,
  selectedProjectId,
  onProjectFilterChange,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const filteredTasks = selectedProjectId
    ? tasks.filter((t) => t.projectId === selectedProjectId)
    : tasks;

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ];

  const handleDragStart = (event: any) => {
    const task = event.active.data.current?.task;
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      await onMoveTask(taskId, newStatus);
    }
  };

  const getTasksForColumn = (status: TaskStatus) => {
    return filteredTasks.filter((t) => t.status === status);
  };

  return (
    <div>
      {/* Project Filter */}
      {onProjectFilterChange && (
        <div className="mb-4">
          <select
            value={selectedProjectId || ''}
            onChange={(e) => onProjectFilterChange(e.target.value || null)}
            className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.clientName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Kanban Columns */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksForColumn(column.id)}
              projects={projects}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="opacity-80">
              <KanbanCard
                task={activeTask}
                project={projects.find((p) => p.id === activeTask.projectId)}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
