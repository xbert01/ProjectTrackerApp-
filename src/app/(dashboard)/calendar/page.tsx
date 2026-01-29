'use client';

import { useState } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { OverdueTasks } from '@/components/calendar/OverdueTasks';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDateForInput } from '@/lib/utils/date';

type TabType = 'calendar' | 'overdue';

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const { projects } = useProjects();
  const { toggleTaskStatus, moveTaskToDate, createTask } = useTasks();
  const {
    view,
    setView,
    currentDate,
    dates,
    tasksByDate,
    overdueTasks,
    goToToday,
    goToPrevious,
    goToNext,
    moveTask,
  } = useCalendar();

  const allTasks = Array.from(tasksByDate.values()).flat();

  const handleMoveToToday = async (taskId: string) => {
    const today = formatDateForInput(new Date());
    await moveTaskToDate(taskId, today);
  };

  const handleAddTask = (date: string) => {
    setSelectedDate(date);
    setNewTaskTitle('');
    setNewTaskProjectId(projects[0]?.id || '');
    setIsAddTaskModalOpen(true);
  };

  const handleSubmitNewTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskProjectId) return;

    setIsAddingTask(true);
    try {
      await createTask({
        projectId: newTaskProjectId,
        title: newTaskTitle.trim(),
        calendarDate: selectedDate,
        status: 'todo',
      });
      setIsAddTaskModalOpen(false);
    } finally {
      setIsAddingTask(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>

        <div className="flex items-center">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`
              px-4 py-2 text-sm font-medium rounded-l-lg border transition-colors
              ${activeTab === 'calendar'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`
              px-4 py-2 text-sm font-medium rounded-r-lg border-t border-b border-r transition-colors
              ${activeTab === 'overdue'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
          >
            Overdue
            {overdueTasks.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {overdueTasks.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'calendar' ? (
        <CalendarGrid
          view={view}
          currentDate={currentDate}
          dates={dates}
          tasks={allTasks}
          projects={projects}
          onMoveTask={moveTask}
          onToggleTask={toggleTaskStatus}
          onViewChange={setView}
          onGoToToday={goToToday}
          onGoToPrevious={goToPrevious}
          onGoToNext={goToNext}
          onAddTask={handleAddTask}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <OverdueTasks
            tasks={overdueTasks}
            projects={projects}
            onToggle={toggleTaskStatus}
            onMoveToToday={handleMoveToToday}
          />
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        title={`Add Task for ${selectedDate}`}
        size="sm"
      >
        <form onSubmit={handleSubmitNewTask} className="space-y-4">
          <Input
            label="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title"
            autoFocus
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project
            </label>
            <select
              value={newTaskProjectId}
              onChange={(e) => setNewTaskProjectId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.clientName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddTaskModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isAddingTask}>
              Add Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
